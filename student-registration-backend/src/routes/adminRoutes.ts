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

router.get("/admin/users", getAllUsers);
router.put("/admin/users/:id", validate(updateUserSchema), updateUser);
router.delete("/admin/users/:id", deleteUser);
router.get("/admin/analytics", getAnalytics);

export default router;
