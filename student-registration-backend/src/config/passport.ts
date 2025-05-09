import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../utils/prismaClient';
import { generateRegistrationNumber } from '../utils/registrationNumber';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in the database
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0]?.value || '' },
        });

        if (!user) {
          // Create a new user if not found
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0]?.value || '',
              image: profile.photos?.[0].value,
              firstName: profile.name?.givenName || 'Google',
              lastName: profile.name?.familyName || 'User',
              password: 'google-oauth', // Placeholder password for OAuth users
              registrationNumber: await generateRegistrationNumber(), // Generate unique registration number
              dateOfBirth: new Date(), // Use current date as a placeholder
              role: 'student', // Default role for Google OAuth users
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: { id: string }, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
