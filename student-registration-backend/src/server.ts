import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import swaggerDocs from "./docs/swagger";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
export const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.use("/api", authRoutes, userRoutes, adminRoutes);

app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.send("Server is running");
});

app.get("/test", (req, res) => {
  res.send("Test route is working");
});

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
process.on("SIGTERM", async () => {
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
  process.exit(0);
});
