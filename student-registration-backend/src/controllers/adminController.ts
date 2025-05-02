import { Request, Response, RequestHandler, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { Role, UserResponse, UsersListResponse, MessageResponse } from "../types";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      id: string;
      [key: string]: any;
    }
    interface Request {
      user?: User;
    }
  }
}

const prisma = new PrismaClient();

// In-memory audit log (for demo; use DB in production)
export const auditLog: Array<{
  id: number;
  action: string;
  userId?: string;
  performedBy: string;
  timestamp: string;
  details?: any;
}> = [];

export function logAudit(
  action: string,
  performedBy: string,
  userId?: string,
  details?: any,
) {
  auditLog.unshift({
    id: Date.now() + Math.random(),
    action,
    userId,
    performedBy,
    timestamp: new Date().toISOString(),
    details,
  });
  if (auditLog.length > 100) auditLog.pop();
}

export const getAuditLog = async (req: Request, res: Response) => {
  res.status(200).json({ log: auditLog.slice(0, 50) });
};

export const getAllUsers = async (
  req: Request,
  res: Response<UsersListResponse | MessageResponse>,
  next: NextFunction
): Promise<Response<UsersListResponse | MessageResponse> | void> => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(500).json({ message: "Invalid pagination parameters" });
    }

    const skip = (page - 1) * limit;

    try {
      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
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
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count(),
      ]);

      const mappedUsers = users.map((user) => ({
        ...user,
        role: user.role as Role,
      }));

      return res.status(200).json({
        users: mappedUsers,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (dbError) {
      return res.status(500).json({ message: "Database error" });
    }
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    if ((startDate && isNaN(startDate.getTime())) || (endDate && isNaN(endDate.getTime()))) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }

    const whereClause = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    } : {};

    try {
      const [totalUsers, totalAdmins, totalStudents, recentUsers] =
        await Promise.all([
          prisma.user.count({ where: whereClause }),
          prisma.user.count({ where: { ...whereClause, role: "admin" } }),
          prisma.user.count({ where: { ...whereClause, role: "student" } }),
          prisma.user.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              createdAt: true,
            },
          }),
        ]);

      res.status(200).json({
        totalUsers,
        totalAdmins,
        totalStudents,
        recentUsers,
      });
      return;
    } catch (dbError) {
      res.status(500).json({ message: "Database error" });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction,
): Promise<Response<MessageResponse> | void> => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'dateOfBirth',
      'registrationNumber',
      'role',
    ];
    const userData: any = {};
    let hasValidFields = false;
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        userData[field] = req.body[field];
        hasValidFields = true;
      }
    }

    if (!hasValidFields) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    if (userData.dateOfBirth) {
      const date = new Date(userData.dateOfBirth);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      userData.dateOfBirth = date;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      logAudit("updateUser", req.user?.id || "unknown", userId, userData);
      return res.status(200).json({ message: "User updated successfully" });
    } catch (dbError: any) {
      // Handle Prisma unique constraint violation
      if (dbError.code === 'P2002') {
        return res.status(400).json({ message: "Email already in use" });
      }
      // Handle record not found
      if (dbError.code === 'P2025') {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(500).json({ message: "Database error" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (existingUser.role === "admin") {
        res.status(403).json({ message: "Cannot delete admin users" });
        return;
      }

      // Delete user from the database
      await prisma.user.delete({ where: { id } });
      logAudit("deleteUser", req.user?.id || "unknown", id);
      res.status(200).json({ message: "User deleted successfully" });
      return;
    } catch (dbError: any) {
      if (dbError.code === 'P2025') {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(500).json({ message: "Database error" });
      return;
    }
  } catch (error) {
    next(error);
  }
};
