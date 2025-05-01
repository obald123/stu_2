import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";
import { logTestResult } from "../utils/logTestResult";

const prisma = new PrismaClient();
let server: any;

function logResultWrapper(testName: string, fn: () => Promise<void>) {
  return async function() {
    try {
      await fn();
      await logTestResult(testName, "passed");
    } catch (err: any) {
      await logTestResult(testName, "failed", err?.message || String(err));
      throw err;
    }
  };
}

describe("Auth API", () => {
  before(async () => {
    server = startServer();
    await prisma.user.deleteMany();
  });

  after(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    stopServer();
  });

  describe("POST /api/register", () => {
    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it("should register a new student when valid data is provided", logResultWrapper("should register a new student when valid data is provided", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "Student registered successfully");
      expect(res.body.user).to.have.property("email", "john.doe@example.com");
      expect(res.body.user.role).to.equal("student");
      expect(res.body).to.have.property("token");
    }));

    it("should return 400 and error message when email is already in use", logResultWrapper("should return 400 and error message when email is already in use", async () => {
      await prisma.user.create({
        data: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          registrationNumber: "REG123456",
          dateOfBirth: new Date("2000-01-01"),
          role: "student",
        },
      });
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(400);
      if (res.body.errors) {
        expect(res.body.errors.some((e: { message: string; }) => /email/i.test(e.message))).to.be.true;
      } else {
        expect(res.body.message).to.match(/email already in use|email/i);
      }
    }));
  });

  describe("POST /api/register - validation and error cases", () => {
    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it("should return 400 if firstName is missing", logResultWrapper("should return 400 if firstName is missing", async () => {
      const res = await request(app).post("/api/register").send({
        lastName: "Doe",
        email: "missing@ex.com",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors &&
        res.body.errors.some((e: { path: string | string[]; message: string; }) =>
          (Array.isArray(e.path) ? e.path.includes('firstName') : e.path === 'firstName') &&
          /required|min|least|string/i.test(e.message)
        )
      ).to.be.true;
    }));

    it("should return 400 if email is invalid", logResultWrapper("should return 400 if email is invalid", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "not-an-email",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors &&
        res.body.errors.some((e: { path: string | string[]; message: string; }) =>
          (Array.isArray(e.path) ? e.path.includes('email') : e.path === 'email') &&
          /email|invalid/i.test(e.message)
        )
      ).to.be.true;
    }));

    it("should return 400 if password is too short", logResultWrapper("should return 400 if password is too short", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "short@ex.com",
        password: "123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors &&
        res.body.errors.some((e: { path: string | string[]; message: string; }) =>
          (Array.isArray(e.path) ? e.path.includes('password') : e.path === 'password') &&
          /password|min|least|string/i.test(e.message)
        )
      ).to.be.true;
    }));

    it("should return 400 if dateOfBirth is invalid format", logResultWrapper("should return 400 if dateOfBirth is invalid format", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "date@ex.com",
        password: "password123",
        dateOfBirth: "01-01-2000",
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors &&
        res.body.errors.some((e: { path: string | string[]; message: string; }) =>
          (Array.isArray(e.path) ? e.path.includes('dateOfBirth') : e.path === 'dateOfBirth') &&
          /date|invalid/i.test(e.message)
        )
      ).to.be.true;
    }));
  });

  describe("POST /api/login", () => {
    beforeEach(async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash("password123", 10);
      await prisma.user.create({
        data: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: hashedPassword,
          registrationNumber: "REG654321",
          dateOfBirth: new Date("2000-01-01"),
          role: "student",
        },
      });
    });
    afterEach(async () => {
      await prisma.user.deleteMany();
    });

    it("should login successfully with valid credentials", logResultWrapper("should login successfully with valid credentials", async () => {
      const res = await request(app).post("/api/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Login successful");
      expect(res.body.user).to.have.property("email", "john.doe@example.com");
      expect(res.body).to.have.property("token");
    }));
  });
});
