import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '.prisma/client';
import { generateRegistrationNumber } from '../utils/registrationNumber';
import { 
  Role, 
  UserDto, 
  UserResponse, 
  AuthSuccessResponse, 
  MessageResponse,
  GoogleTokenVerifyRequest,
  GoogleRegistrationRequest
} from '../types';
import { sendPasswordResetEmail } from '../utils/emailService';
import { rateLimit } from 'express-rate-limit';
import passport from 'passport';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: "Too many login attempts from this IP, please try again after 15 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true // Don't count successful logins against the rate limit
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: { message: "Too many reset attempts. Please try again in 15 minutes." }
});

export const registerStudent = async (
  req: Request<{}, {}, UserDto>,
  res: Response<AuthSuccessResponse | MessageResponse>,
  next: Function,
): Promise<Response<AuthSuccessResponse | MessageResponse> | void> => {
  try {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    // Password validation - match the schema validation message
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const registrationNumber = await generateRegistrationNumber();

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          registrationNumber,
          dateOfBirth: new Date(dateOfBirth),
          role: "student",
        },
      });

      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        jwtSecret,
        { expiresIn: "1h" },
      );

      return res.status(201).json({
        message: "Student registered successfully",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          registrationNumber: newUser.registrationNumber,
          dateOfBirth: newUser.dateOfBirth,
          role: newUser.role as Role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        token,
      });
    } catch (dbError) {
      if (dbError instanceof Error) {
        next(dbError);
        return;
      }
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response<AuthSuccessResponse | MessageResponse>,
  next: Function,
): Promise<Response<AuthSuccessResponse | MessageResponse>> => {
  try {
    const { email, password, keepSignedIn } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        registrationNumber: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        googleId: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If user has googleId, they should use Google Sign-In
    if (user.googleId) {
      return res.status(400).json({ 
        message: "This account uses Google Sign-In. Please sign in with Google." 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with longer expiration if keepSignedIn is true
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: keepSignedIn ? "30d" : "1h" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
    return Promise.reject(error);
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: Function
): Promise<Response | void> => {
  try {
    const userId = (req as any).userId;
    
    // Find user by ID and include googleId in select
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        registrationNumber: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        googleId: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ valid: true, user });
  } catch (error) {
    next(error);
    return Promise.reject(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response<MessageResponse>,
  next: Function
): Promise<Response<MessageResponse> | void> => {
  try {
    const { email } = req.body;

    // Always wait a random amount of time between 1-2 seconds
    // This helps prevent timing attacks that could determine if an email exists
    const randomDelay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, randomDelay));

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ 
        message: "If an account exists with this email, you will receive a password reset link." 
      });
    }

    // Check if a reset token was already issued in the last 15 minutes
    const lastReset = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
        }
      }
    });

    if (lastReset) {
      // Don't reveal that a token already exists
      return res.status(200).json({ 
        message: "If an account exists with this email, you will receive a password reset link." 
      });
    }

    // Generate reset token that expires in 15 minutes
    const resetToken = jwt.sign(
      { 
        userId: user.id, 
        purpose: 'password_reset',
        email: user.email 
      },
      jwtSecret,
      { expiresIn: "15m" }
    );

    try {
      // Store the reset attempt
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
        }
      });

      await sendPasswordResetEmail(user.email, resetToken, user.firstName);
      
      return res.status(200).json({ 
        message: "If an account exists with this email, you will receive a password reset link." 
      });
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({ 
        message: "An error occurred. Please try again later." 
      });
    }
  } catch (error) {
    next(error);
    return;
  }
};

export const resetPassword = async (
  req: Request,
  res: Response<MessageResponse>,
  next: Function
): Promise<Response<MessageResponse> | void> => {
  try {
    const { token, password } = req.body;

    // Verify token exists and is not already used
    const resetRecord = await prisma.passwordReset.findFirst({
      where: { 
        token,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { 
        userId: string; 
        purpose: string;
        email: string;
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(400).json({ message: "Reset token has expired" });
      }
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Verify this is a password reset token
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: "Invalid token type" });
    }

    // Check if user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password and mark token as used in a transaction
    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: decoded.userId },
          data: { password: hashedPassword },
        }),
        prisma.passwordReset.update({
          where: { id: resetRecord.id },
          data: { used: true }
        })
      ]);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (dbError) {
      console.error('Error updating password:', dbError);
      return res.status(500).json({ message: "Error updating password" });
    }
  } catch (error) {
    next(error);
    return;
  }
};

export const googleCallback = (req: Request, res: Response, next: Function) => {
  passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error('Google Auth Error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`);
    }
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    try {
      // Generate JWT token for the user
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,
        { expiresIn: '30d' } // Long-lived token for OAuth users
      );

      // Encode user data to pass in URL
      const userStr = encodeURIComponent(JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        registrationNumber: user.registrationNumber
      }));

      // Redirect to frontend with token and user data
      return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&user=${userStr}`);
    } catch (error) {
      console.error('Token Generation Error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  })(req, res, next);
};

export const verifyGoogleAuth = async (
  req: Request<{}, {}, GoogleTokenVerifyRequest>,
  res: Response
): Promise<void> => {
  try {
    const { token, userData } = req.body;

    if (!token || !userData) {
      res.status(400).json({ message: 'Missing token or user data' });
      return;
    }

    // Always verify with Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
      }

      // Verify token matches user data
      if (payload.sub !== userData.sub) {
        console.error('Token sub mismatch:', { payloadSub: payload.sub, userDataSub: userData.sub });
        res.status(401).json({ message: 'Token mismatch' });
        return;
      }

      // Verify email matches
      if (payload.email !== userData.email) {
        console.error('Email mismatch:', { payloadEmail: payload.email, userDataEmail: userData.email });
        res.status(401).json({ message: 'Email mismatch' });
        return;
      }
    } catch (googleError) {
      console.error('Token verification error:', googleError);
      res.status(401).json({ 
        message: 'Token verification failed',
        error: googleError instanceof Error ? googleError.message : 'Unknown error'
      });
      return;
    }// Validate required data
    if (!userData?.email || !userData?.sub || !userData?.given_name || !userData?.family_name) {
      res.status(400).json({ message: 'Invalid user data' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { googleId: userData.sub }
        ]
      }
    });

    if (existingUser) {
      // Generate JWT token
      const authToken = jwt.sign(
        { userId: existingUser.id, role: existingUser.role },
        jwtSecret,
        { expiresIn: '30d' }
      );

      res.status(200).json({
        exists: true,
        user: {
          id: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          role: existingUser.role,
          registrationNumber: existingUser.registrationNumber,
          dateOfBirth: existingUser.dateOfBirth,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt
        },
        token: authToken
      });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Google Auth Verification Error:', error);
    res.status(500).json({ message: 'Error verifying Google credentials' });
  }
};

export const registerWithGoogle = async (
  req: Request<{}, {}, GoogleRegistrationRequest>,
  res: Response
): Promise<void> => {
  try {
    const { token, userData, dateOfBirth } = req.body;    // Verify token with Google OAuth2 client
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('Google client ID not configured');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        res.status(401).json({ message: 'Invalid token payload' });
        return;
      }

      // Verify token matches user data
      if (payload.sub !== userData.sub) {
        res.status(401).json({ message: 'Token mismatch' });
        return;
      }

      // Verify email matches
      if (payload.email !== userData.email) {
        res.status(401).json({ message: 'Email mismatch' });
        return;
      }
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      const errorMessage = verifyError instanceof Error ? verifyError.message : 'Unknown error';
      res.status(401).json({ message: `Token verification failed: ${errorMessage}` });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { googleId: userData.sub }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Generate registration number
    const registrationNumber = await generateRegistrationNumber();    // Generate a secure random password for Google users
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        firstName: userData.given_name,
        lastName: userData.family_name,
        email: userData.email,
        googleId: userData.sub,
        registrationNumber,
        dateOfBirth: new Date(dateOfBirth),
        role: 'student',
        password: hashedPassword, // Required field but not used for Google auth
      }
    });

    // Generate JWT token
    const authToken = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      jwtSecret,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        registrationNumber: newUser.registrationNumber,
        dateOfBirth: newUser.dateOfBirth,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      },
      token: authToken
    });
  } catch (error) {
    console.error('Google Registration Error:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
};
