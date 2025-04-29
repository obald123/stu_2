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
): Promise<Response<AuthSuccessResponse | MessageResponse>> => {
  try {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate registration number
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

    // Generate JWT token
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
  } catch (error) {
    next(error);
    return Promise.reject(error);
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
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    next(error);
    return Promise.reject(error);
  }
};
