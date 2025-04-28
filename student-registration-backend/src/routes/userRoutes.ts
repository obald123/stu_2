import { Router } from "express";
import { getProfile, getUserQRCode, testUserQRCode } from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const router = Router();


router.get("/profile", authenticate, testUserQRCode);
router.get("/users/:id", getUserQRCode);


export default router;
