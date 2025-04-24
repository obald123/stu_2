import { Router } from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/adminController';
import authenticate from '../middleware/authenticate';
import authorizeAdmin from '../middleware/authorizeAdmin';
import validate from '../middleware/validate';
import { updateUserSchema } from '../validations/userValidation';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id', validate(updateUserSchema), updateUser);
router.delete('/users/:id', deleteUser);

export default router;