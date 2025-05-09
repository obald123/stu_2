import { Router, Request, Response, NextFunction } from 'express';
import { registerStudent, loginUser, verifyToken, forgotPassword, resetPassword, loginLimiter } from '../controllers/authController';
import validate from '../middleware/validate';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/authValidation';
import passport from 'passport';

const router = Router();

// Wrap async handlers to properly catch errors
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.post('/register', validate(registerSchema), asyncHandler(registerStudent));
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(loginUser));
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password/:token', validate(resetPasswordSchema as any), asyncHandler(resetPassword));

// Token verification route
router.get('/verify', asyncHandler(verifyToken));

// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback route
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), async (req, res) => {
  const user = req.user;

  console.log('Authenticated user:', user); // Debug log to verify the structure of req.user

  // Check if user exists in the database
  if (user) {
    req.login(user, (err) => {
      if (err) {
        return res.redirect('/login');
      }      // Redirect to frontend URLs
      if (user.role === 'admin') {
        res.redirect('http://localhost:3000/admin/users');
      } else {
        res.redirect(`http://localhost:3000/users/${user.id}`);
      }
    });
  } else {
    // Handle unexpected cases
    res.redirect('/login');
  }
});

// Landing page route
router.get('/landing', (req, res) => {
  res.send('Welcome to the landing page!');
});

export default router;
