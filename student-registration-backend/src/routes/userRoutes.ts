import { Router } from 'express';
import { getProfile } from '../controllers/userController';
import authenticate from '../middleware/authenticate';

const router = Router();

router.get('/profile', authenticate, getProfile);

export default router;