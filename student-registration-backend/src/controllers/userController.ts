import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";
import { Role, UserResponse, MessageResponse } from "../types";

const prisma = new PrismaClient();

// Extend the Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response<UserResponse | MessageResponse>,
): Promise<Response<UserResponse | MessageResponse>> => {
  try {
    // Make sure req.userId is set by your authentication middleware
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: userId not set on request" });
    }
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
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ ...user, role: user.role as Role });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const testUserQRCode = async (
  req: any, 
  res: Response
): Promise<Response> => {
  try {
    //  use req.userId (for /profile)
    const userId = req.userId;
    let user = undefined;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          registrationNumber: true,
        },
      });
    }
    if (!user) {
      // sample to checkk
      user = {
        firstName: "Sample",
        lastName: "User",
        email: "sample.user@example.com",
        registrationNumber: "SAMPLE1234",
      };
    }
    const qrData = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      registrationNumber: user.registrationNumber,
    };
    const qrString = JSON.stringify(qrData);
    const qrImage = await QRCode.toDataURL(qrString);
    const img = Buffer.from(qrImage.split(",")[1], "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
    return res;
  } catch (error) {
    console.error("QR code test error:", error);
    res.status(500).json({ message: "Internal server error" });
    return Promise.reject(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response<UserResponse | MessageResponse>
): Promise<Response<UserResponse | MessageResponse>> => {
  const userId = req.params.id;
  console.log('[getUserById] Requested userId:', userId);
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
    console.log('[getUserById] DB result:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ ...user, role: user.role as Role });
  } catch (error) {
    console.error('[getUserById] Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
