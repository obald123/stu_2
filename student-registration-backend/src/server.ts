import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import swaggerDocs from './docs/swagger';
import dotenv from 'dotenv';
import authenticate from './middleware/authenticate';
import passport from './config/passport';
import session from 'express-session';

dotenv.config();

const prisma = new PrismaClient();
export const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: 'http://localhost:3000', // Specify the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow credentials
  })
);
app.use(express.json());

// Initialize Passport.js with secure session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Public routes (no auth required)
app.use('/api', authRoutes);

// Protected routes (require auth)
app.use('/api', authenticate, userRoutes);
app.use('/api', authenticate, adminRoutes);

app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Server is running');
});

app.get('/test', (req, res) => {
  res.send('Test route is working');
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('--- Express Error Handler ---');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);

  // Handle rate limit errors
  if (err.statusCode === 429) {
    res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: err.message || 'Too many requests, please try again later'
    });
    return;
  }

  // Handle validation errors (Zod, Express-validator, etc)
  if (err.name === 'ValidationError' || err.name === 'ZodError' || err.name === 'BadRequestError') {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      errors: err.errors || []
    });
    return;
  }

  // Handle Prisma database errors
  if (typeof err.code === 'string' && err.code.startsWith('P')) {
    res.status(500).json({
      error: 'Database Error',
      message: 'An error occurred while accessing the database'
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Authentication Error',
      message: err.message
    });
    return;
  }

  // Default internal server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
};

app.use(errorHandler);

let server: any = null;

export function startServer() {
  swaggerDocs(app, Number(port));
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  return server;
}

export function stopServer() {
  if (server) {
    server.close();
  }
}

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
  process.exit(0);
});
