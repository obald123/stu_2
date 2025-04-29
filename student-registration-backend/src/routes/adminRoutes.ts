import { Router } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getAnalytics,
} from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import authorizeAdmin from "../middleware/authorizeAdmin";
import validate from "../middleware/validate";
import { updateUserSchema } from "../validations/userValidation";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/users", asyncHandler(getAllUsers));
router.put("/users/:id", validate(updateUserSchema), asyncHandler(updateUser));
router.delete("/users/:id", asyncHandler(deleteUser));
router.get("/analytics", asyncHandler(getAnalytics));

export default router;
