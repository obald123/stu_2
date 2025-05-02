import { Router } from "express";
import { registerStudent, loginUser, verifyToken } from "../controllers/authController";
import validate from "../middleware/validate";
import { registerSchema, loginSchema } from "../validations/authValidation";

const router = Router();

// Wrap async handlers to properly catch errors
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.post("/register", validate(registerSchema), asyncHandler(registerStudent));
router.post("/login", validate(loginSchema), asyncHandler(loginUser));

// Token verification route
router.get("/verify", asyncHandler(verifyToken));

export default router;
