import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler<T = any>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
