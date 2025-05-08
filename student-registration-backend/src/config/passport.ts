import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Check required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  console.error('Missing required Google OAuth environment variables');
  process.exit(1);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (_req, _accessToken, _refreshToken, profile, done) => {
      try {
        // Log the profile for debugging
        console.log('Google profile:', JSON.stringify(profile, null, 2));

        if (!profile.emails?.[0]?.value) {
          return done(new Error('No email provided from Google'));
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: profile.emails[0].value },
              { googleId: profile.id }
            ]
          }
        });

        if (existingUser) {
          // Return existing user
          return done(null, {
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            role: existingUser.role
          });
        }

        // For new users, return profile data
        return done(null, {
          id: profile.id, // Temporary ID, will be replaced upon registration
          email: profile.emails[0].value,
          firstName: profile.name?.givenName || profile.displayName.split(' ')[0],
          lastName: profile.name?.familyName || profile.displayName.split(' ').slice(1).join(' '),
          role: 'student',
          isNewUser: true
        });
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error instanceof Error ? error : new Error('Authentication failed'));
      }
    }
  )
);

// Serialize just the necessary user data
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize by fetching the user from database
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return done(new Error('User not found'));
    }

    done(null, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  } catch (error) {
    done(error);
  }
});

export default passport;
