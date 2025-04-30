import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Role, UserResponse, MessageResponse } from "../types";
import QRCode from "qrcode";

const prisma = new PrismaClient();

export const getUserById = async (
  req: Request,
  res: Response
): Promise<UserResponse | MessageResponse | any > => {
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
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ ...user, role: user.role as Role });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserQRCode = async (
  req: Request,
  res: Response
): Promise<UserResponse | MessageResponse | any > => {
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
      return res.status(404).json({ message: "User not found" });
    }
    const qrData = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      registrationNumber: user.registrationNumber,
    };
    const qrString = JSON.stringify(qrData);
    const qrImage = await QRCode.toDataURL(qrString, { errorCorrectionLevel: 'M', width: 300 });
    // Remove the data URL prefix and send as PNG
    const img = Buffer.from(qrImage.split(",")[1], "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (error) {
    console.error("QR code error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
