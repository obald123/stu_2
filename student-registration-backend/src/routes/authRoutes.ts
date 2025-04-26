import { Router } from 'express';
import { registerStudent, loginUser } from '../controllers/authController';
import validate from '../middleware/validate';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', validate(registerSchema), registerStudent);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), loginUser);

export default router;