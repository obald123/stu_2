# Student Registration Backend

This is the backend for the Student Registration System, built with **Express.js** and **Prisma**.

## Features
- User authentication (JWT)
- User registration and profile management
- Admin user management (CRUD)
- Audit log for admin actions
- API documentation with Swagger

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your database (PostgreSQL recommended):
   - Update your `.env` file with the correct database URL.
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Project Structure
- `src/` - Main server code
- `controllers/` - Route controllers
- `middleware/` - Express middleware
- `routes/` - API routes
- `services/` - Business logic
- `utils/` - Utility functions
- `validations/` - Zod validation schemas

## Technologies Used
- Express.js
- Prisma ORM
- PostgreSQL
- Zod
- JWT Authentication
- Swagger (API docs)

## Environment Variables
Create a `.env` file with your database and JWT secrets.

---
See the frontend README for UI and client setup.
