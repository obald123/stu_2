import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { generateRegistrationNumber } from '../utils/registrationNumber';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email: profile.emails![0].value }
        });

        if (!user) {
          // Create new user if doesn't exist
          user = await prisma.user.create({
            data: {
              email: profile.emails![0].value,
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              password: '', // Empty password for OAuth users
              registrationNumber: await generateRegistrationNumber(),
              role: 'student',
              googleId: profile.id,
              dateOfBirth: new Date(), // Default date, user can update later
            },
          });
        } else if (!user.googleId) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id }
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Export the configured passport instance
export { passport };
