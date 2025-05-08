import { Router, Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import passport from '../config/passport';
import { registerStudent, loginUser, verifyToken, forgotPassword, resetPassword, loginLimiter, verifyGoogleAuth, registerWithGoogle } from '../controllers/authController';
import validate from '../middleware/validate';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/authValidation';

const router = Router();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Public routes
router.post('/register', validate(registerSchema), asyncHandler(registerStudent));
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(loginUser));
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password/:token', validate(resetPasswordSchema), asyncHandler(resetPassword));

// Google OAuth routes with enhanced error handling
router.get('/auth/google',
  (req, res, next) => {
    console.log('Starting Google OAuth flow...');
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent'
    })(req, res, next);
  }
);

router.get('/auth/google/callback',
  (req, res, next) => {
    console.log('Received callback from Google');
    passport.authenticate('google', { session: false }, (err, user) => {
      if (err) {
        const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
        console.error('Google Auth Error:', errorMsg);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(errorMsg)}`);
      }

      if (!user) {
        console.error('No user data received from Google');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }

      try {
        // For existing users
        if (!user.isNewUser) {
          const token = jwt.sign(
            {
              userId: user.id,
              role: user.role,
              provider: 'google'
            },
            jwtSecret,
            { expiresIn: '30d' }
          );

          const userStr = encodeURIComponent(JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }));

          return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&user=${userStr}`);
        }

        // For new users - create a temporary token with registration data
        const tempToken = jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            googleId: user.id,
            purpose: 'registration'
          },
          jwtSecret,
          { expiresIn: '1h' }
        );

        const registrationData = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          googleId: user.id
        };

        return res.redirect(
          `${process.env.FRONTEND_URL}/login?` +
          `registrationToken=${tempToken}&` +
          `registrationData=${encodeURIComponent(JSON.stringify(registrationData))}`
        );

      } catch (error) {
        console.error('Error in Google callback:', error);
        const errorMsg = error instanceof Error ? error.message : 'Internal server error';
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(errorMsg)}`);
      }
    })(req, res, next);
  }
);

// Google authentication routes
router.post('/auth/google/verify', asyncHandler(verifyGoogleAuth));
router.post('/auth/google/register', asyncHandler(registerWithGoogle));

// Token verification route
router.get('/verify', asyncHandler(verifyToken));

export default router;
function asyncHandler<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = qs.ParsedQs
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<Response<ResBody> | void>
): import('express-serve-static-core').RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    Promise.resolve(fn(req as Request<P, ResBody, ReqBody, ReqQuery>, res as Response<ResBody>, next))
      .then(() => {
        if (!res.headersSent) {
          return next();
        }
      })
      .catch(next);
  };
}

