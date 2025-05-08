import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import swaggerDocs from './docs/swagger';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();
export const app = express();
const port = Number(process.env.PORT) || 8000;

// Configure CORS with credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// Trust proxy - needed for OAuth callbacks behind proxy
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

// Routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Swagger documentation
swaggerDocs(app, port);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.log(` Server is running at http://localhost:${port}`);
    console.log(` API Documentation available at http://localhost:${port}/api-docs`);
  });
}

export default app;
