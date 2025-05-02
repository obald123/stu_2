import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { generateRegistrationNumber } from "../utils/registrationNumber";
import { Role, UserDto, UserResponse, AuthSuccessResponse, MessageResponse } from "../types";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

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
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });

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
