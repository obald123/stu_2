import { Router } from 'express';
import { getUserById, getUserQRCode } from '../controllers/userController';
import authenticate from '../middleware/authenticate';

const router = Router();



router.get('/users/:id', authenticate, getUserById);
router.get('/users/:id/qrcode', authenticate, getUserQRCode);


export default router;
