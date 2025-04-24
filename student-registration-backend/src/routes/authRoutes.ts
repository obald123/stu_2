import { Router } from 'express';
import { registerStudent, loginUser } from '../controllers/authController';
import validate from '../middleware/validate';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = Router();

router.post('/register', validate(registerSchema), registerStudent);
router.post('/login', validate(loginSchema), loginUser);

export default router;