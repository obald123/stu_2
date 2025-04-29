import { Router } from "express";
import { registerStudent, loginUser } from "../controllers/authController";
import validate from "../middleware/validate";
import { registerSchema, loginSchema } from "../validations/authValidation";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/register", validate(registerSchema), asyncHandler(registerStudent));
router.post("/login", validate(loginSchema), asyncHandler(loginUser));


export default router;
