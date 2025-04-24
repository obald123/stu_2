# Student Registration System

This is a full-stack application for managing student registrations, built with **Next.js** for the frontend and **Express.js** with **Prisma** for the backend.

## Features
- User registration and login
- Admin dashboard for managing users
- Profile management
- JWT-based authentication
- Responsive UI

## Prerequisites
- Node.js (v16+)
- PostgreSQL database

## Setup Instructions

### Backend
1. Navigate to the backend directory:
   ```sh
   cd stu_2/student-registration-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with the following content:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5005
   ```
4. Run Prisma migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Start the backend server:
   ```sh
   npm start
   ```

### Frontend
1. Navigate to the frontend directory:
   ```sh
   cd stu_2/student-registration-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, Prisma, PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod


