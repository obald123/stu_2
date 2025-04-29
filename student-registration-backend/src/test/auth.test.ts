import { expect } from "chai";
import request from "supertest";
import { app } from "../server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth API", () => {
  before(async () => {
    // Clean up database before tests
    await prisma.user.deleteMany();
  });

  after(async () => {
    // Clean up database after tests
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /api/register", () => {
    it("should register a new student", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property(
        "message",
        "Student registered successfully",
      );
      expect(res.body.user).to.have.property("email", "john.doe@example.com");
      expect(res.body.user.role).to.equal("student");
      expect(res.body).to.have.property("token");
    });

    it("should fail with duplicate email", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Email already in use");
    });
  });

  describe("POST /api/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Login successful");
      expect(res.body.user).to.have.property("email", "john.doe@example.com");
      expect(res.body).to.have.property("token");
    });

    it("should fail with invalid credentials", async () => {
      const res = await request(app).post("/api/login").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Invalid credentials");
    });
  });

  describe("GET /api/profile (QR code tester)", () => {
    let token: string;
    before(async () => {
      // Login to get a valid token
      const res = await request(app).post("/api/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });
      token = res.body.token;
    });

    it("should return a PNG image as QR code", async () => {
      const res = await request(app)
        .get("/api/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(res.headers["content-type"]).to.equal("image/png");
      expect(res.body).to.be.instanceOf(Buffer);
      // Optionally, check that the image is not empty
      expect(res.body.length).to.be.greaterThan(100);
    });
  });
});
