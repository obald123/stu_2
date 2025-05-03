import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from ".prisma/client";
import { generateRegistrationNumber } from "../utils/registrationNumber";
import { Role, UserDto, UserResponse, AuthSuccessResponse, MessageResponse } from "../types";
import { sendPasswordResetEmail } from "../utils/emailService";
import { rateLimit } from 'express-rate-limit';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
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

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        registrationNumber: user.registrationNumber,
        dateOfBirth: user.dateOfBirth,
        role: user.role as Role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
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
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (typeof decoded === "object" && decoded !== null) {
        req.user = decoded as any;
        return res.status(200).json({ valid: true, user: decoded });
      } else {
        return res.status(401).json({ message: "Token has expired" });
      }
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(401).json({ message: "Token has expired" });
    }
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
