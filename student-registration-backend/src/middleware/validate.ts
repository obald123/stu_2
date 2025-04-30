import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Combine body and params for Zod validation
    const result = schema.safeParse({ body: req.body, params: req.params });
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
    } else {
      next();
    }
  };

export default validate;
