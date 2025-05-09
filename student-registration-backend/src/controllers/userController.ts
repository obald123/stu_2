import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Role } from '../types';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
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
        password: true,
        updatedAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ ...user, role: user.role as Role });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserQRCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        registrationNumber: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const qrImage = await QRCode.toDataURL(JSON.stringify(user));
    const img = Buffer.from(qrImage.split(',')[1], 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    });
    res.end(img);
  } catch (error) {
    console.error('QR code error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
