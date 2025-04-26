import { Router } from 'express';
import { getProfile } from '../controllers/userController';
import authenticate from '../middleware/authenticate';

const router = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, getProfile);

export default router;