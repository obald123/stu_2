import { Router } from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getAnalytics,
} from '../controllers/adminController';
import authenticate from '../middleware/authenticate';
import authorizeAdmin from '../middleware/authorizeAdmin';
import validate from '../middleware/validate';
import { updateUserSchema } from '../validations/userValidation';

const router = Router();

router.use(authenticate, authorizeAdmin);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update a user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.put('/users/:id', validate(updateUserSchema), updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get user analytics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/analytics', getAnalytics);

export default router;