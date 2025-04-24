import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { generateRegistrationNumber } from '../utils/registrationNumber';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerStudent = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Hash password
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
        role: 'student',
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        registrationNumber: newUser.registrationNumber,
        role: newUser.role,
      },
      token,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = user && await bcrypt.compare(password, user.password);
    if (!user || !isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role,
      },
      token,
    });
    return;
  } catch (error) {
    next(error);
  }
};