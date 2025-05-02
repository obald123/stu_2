import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format validation errors to match test expectations
        const errors = error.errors.map(err => ({
          path: err.path,
          message: err.message
        }));
        res.status(400).json({ errors });
        return;
      }
      next(error);
    }
  };

export default validate;
