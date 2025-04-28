import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";

const prisma = new PrismaClient();

// Extend the Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    // User ID is set by the authenticate middleware
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
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
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserQRCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
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
      res.status(404).json({ message: "User not found" });
      return;
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
  } catch (error) {
    console.error("QR code error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const testUserQRCode = async (
  req: any, // Accept AuthenticatedRequest or Request
  res: Response
): Promise<void> => {
  try {
    // Use req.params.id if present, otherwise use req.userId (for /profile)
    const userId = req.params?.id || req.userId;
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
      // Provide a sample user if not found
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
  } catch (error) {
    console.error("QR code test error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
