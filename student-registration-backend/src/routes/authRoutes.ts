import { Router } from "express";
import jwt from "jsonwebtoken";
import { passport } from "../config/passport";
import { registerStudent, loginUser, verifyToken, forgotPassword, resetPassword, loginLimiter, googleCallback } from "../controllers/authController";
import validate from "../middleware/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/authValidation";

const router = Router();

// Wrap async handlers to properly catch errors
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.post("/register", validate(registerSchema), asyncHandler(registerStudent));
router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(loginUser));
router.post("/forgot-password", validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post("/reset-password/:token", validate(resetPasswordSchema as any), asyncHandler(resetPassword));

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  asyncHandler(googleCallback)
);

// Token verification route
router.get("/verify", asyncHandler(verifyToken));

export default router;
