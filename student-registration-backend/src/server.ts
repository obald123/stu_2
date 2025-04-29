import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import swaggerDocs from "./utils/swagger";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
export const app = express();
const port = process.env.PORT || 5005;

app.use(
  cors({
    origin: '*', // Or specify your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.send("Server is running");
});

app.get("/test", (req, res) => {
  res.send("Test route is working");
});


swaggerDocs(app, Number(port));

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("--- Express Error Handler ---");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    if (err instanceof Error && err.name) {
      console.error("Name:", err.name);
    }
    if (err.code) {
      console.error("Code:", err.code);
    }
    if (err.meta) {
      console.error("Meta:", err.meta);
    }
    if (err.errors) {
      console.error("Errors:", err.errors);
    }
    console.error("Full error object:", err);
    res.status(500).json({ error: "Internal Server Error" });
  },
);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
