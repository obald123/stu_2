import { Request, Response, RequestHandler, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

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
const auditLog: Array<{
  id: number;
  action: string;
  userId?: string;
  performedBy: string;
  timestamp: string;
  details?: any;
}> = [];

export function logAudit(action: string, performedBy: string, userId?: string, details?: any) {
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

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
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.status(200).json({
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalAdmins, totalStudents, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
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
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response, next: any): Promise<void> => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    // Update user in the database
    await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    logAudit('updateUser', req.user?.id || 'unknown', userId, userData);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Don't allow deleting admin users
    if (existingUser.role === 'admin') {
      res.status(403).json({ message: 'Cannot delete admin users' });
      return;
    }

    await prisma.user.delete({ where: { id } });
    logAudit('deleteUser', req.user?.id || 'unknown', id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};