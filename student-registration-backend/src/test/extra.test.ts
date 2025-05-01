import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
let server: any;

describe("Server and Middleware", () => {
  before(async () => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

  it("should return 200 for root route", async () => {
    const res = await request(app).get("/");
    expect(res.status).to.equal(200);
    expect(res.text).to.include("Server is running");
  });

  it("should return 200 for /test route", async () => {
    const res = await request(app).get("/test");
    expect(res.status).to.equal(200);
    expect(res.text).to.include("Test route is working");
  });
});

describe("Middleware: authenticate", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/users/someid");
    expect(res.status).to.equal(401);
    expect(res.body.message).to.match(/token/i);
  });

  it("should return 401 if token is invalid", async () => {
    const res = await request(app)
      .get("/api/users/someid")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).to.equal(401);
    expect(res.body.message).to.match(/invalid token/i);
  });
});

describe("Middleware: authorizeAdmin", () => {
  it("should return 403 if user is not admin", async () => {
    // Create a student user and get token
    const user = await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "Student",
        email: "student@example.com",
        password: "password123",
        registrationNumber: "REGADMIN1",
        dateOfBirth: new Date("2000-01-01"),
        role: "student",
      },
    });
    const token = jwt.sign({ userId: user.id, role: "student" }, jwtSecret);
    const res = await request(app)
      .get("/api/admin/audit-log")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(403);
    expect(res.body.message).to.match(/admin access required/i);
    await prisma.user.deleteMany({ where: { email: "student@example.com" } });
  });
});

describe("Controllers: userController", () => {
  let userId: string;
  let token: string;
  beforeEach(async () => {
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        firstName: "User",
        lastName: "Test",
        email: "usertest@example.com",
        password: "password123",
        registrationNumber: "REGUSER1",
        dateOfBirth: new Date("2000-01-01"),
        role: "student",
      },
    });
    userId = user.id;
    token = jwt.sign({ userId, role: "student" }, jwtSecret);
  });
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should return 404 if user not found", async () => {
    const res = await request(app)
      .get(`/api/users/invalid-id`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(404);
    expect(res.body.message).to.match(/not found/i);
  });
});

describe("Controllers: adminController", () => {
  let adminId: string;
  let adminToken: string;
  beforeEach(async () => {
    await prisma.user.deleteMany();
    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "password123",
        registrationNumber: "REGADMIN2",
        dateOfBirth: new Date("1990-01-01"),
        role: "admin",
      },
    });
    adminId = admin.id;
    adminToken = jwt.sign({ userId: adminId, role: "admin" }, jwtSecret);
  });
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should return 200 and audit log for admin", async () => {
    const res = await request(app)
      .get("/api/admin/audit-log")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("log");
  });
});
