import { Request, Response, NextFunction, RequestHandler } from 'express';

interface AuthenticatedRequest extends Request {
  role?: string;
}

const authorizeAdmin: RequestHandler = (req, res, next) => {
  if ((req as AuthenticatedRequest).role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};

export default authorizeAdmin;