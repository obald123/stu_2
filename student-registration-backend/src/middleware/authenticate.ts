import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  // First check if user is authenticated via Passport session
  if (req.isAuthenticated()) {
    return next();
  }

  // If not authenticated via session, try JWT
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      role: string;
    };
    (req as AuthenticatedRequest).userId = decoded.userId;
    (req as AuthenticatedRequest).role = decoded.role;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
      return;
    }
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export default authenticate;
