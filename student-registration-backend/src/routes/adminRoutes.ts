import { Router } from "express";
import type { RequestHandler } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getAnalytics,
  getAuditLog,
} from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import authorizeAdmin from "../middleware/authorizeAdmin";
import validate from "../middleware/validate";
import { updateUserSchema } from "../validations/userValidation";

const router = Router();

router.use(authenticate, authorizeAdmin);

// Route handlers with void returns
const handleGetAllUsers: RequestHandler = (req, res, next) => {
  getAllUsers(req, res, next);
};

const handleUpdateUser: RequestHandler = (req, res, next) => {
  updateUser(req, res, next);
};

const handleDeleteUser: RequestHandler = (req, res, next) => {
  deleteUser(req, res, next);
};

const handleGetAnalytics: RequestHandler = (req, res, next) => {
  getAnalytics(req, res, next);
};

const handleGetAuditLog: RequestHandler = (req, res) => {
  getAuditLog(req, res);
};

// Routes with properly typed handlers
router.get("/admin/users", handleGetAllUsers);
router.put("/admin/users/:id", validate(updateUserSchema), handleUpdateUser);
router.delete("/admin/users/:id", handleDeleteUser);
router.get("/admin/analytics", handleGetAnalytics);
router.get("/admin/audit-log", handleGetAuditLog);

export default router;
