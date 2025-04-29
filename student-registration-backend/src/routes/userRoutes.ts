import { Router } from "express";
import { testUserQRCode, getUserById } from '../controllers/userController';
import authenticate from "../middleware/authenticate";

const router = Router();



router.get("/users/:id", (req, res, next) => {
  Promise.resolve(getUserById(req, res)).catch(next);
}); 


export default router;
