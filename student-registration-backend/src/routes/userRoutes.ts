import { Router } from "express";
import { getProfile, getUserQRCode, testUserQRCode } from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const router = Router();

// Replace getProfile with testUserQRCode for /profile
router.get("/profile", authenticate, testUserQRCode);
router.get("/user/:id/qrcode", getUserQRCode);
router.get("/user/:id/qrcode/test", testUserQRCode);

export default router;
