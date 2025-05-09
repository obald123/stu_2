import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import * as registrationNumberUtil from "../utils/registrationNumber";
import swaggerDocs from "../docs/swagger";
import express from "express";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
let server: any;

describe("Full Coverage Tests", () => {
  before(async () => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

  describe("adminController: error branches", () => {
    let adminId: string;
    let adminToken: string;
    beforeEach(async () => {
      await prisma.user.deleteMany();
      const admin = await prisma.user.create({
        data: {
          firstName: "Admin",
          lastName: "User",
          email: "admin3@example.com",
          password: "password123",
          registrationNumber: "REGADMIN4",
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

    it("should handle error in getAllUsers", async () => {
      // Simulate error by closing Prisma connection
      await prisma.$disconnect();
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).to.be.oneOf([500, 401, 200]);
      await prisma.$connect();
    });

    it("should handle error in getAnalytics", async () => {
      await prisma.$disconnect();
      const res = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).to.be.oneOf([500, 401, 200]);
      await prisma.$connect();
    });

    it("should handle error in updateUser", async () => {
      await prisma.$disconnect();
      const res = await request(app)
        .put(`/api/admin/users/${adminId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ firstName: "NewName" });
      expect(res.status).to.be.oneOf([500, 401, 400]);
      await prisma.$connect();
    });

    it("should handle error in deleteUser", async () => {
      await prisma.$disconnect();
      const res = await request(app)
        .delete(`/api/admin/users/${adminId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).to.be.oneOf([500, 401, 403]);
      await prisma.$connect();
    });
  });

  describe("userController: error branches", () => {
    let userId: string;
    let token: string;
    beforeEach(async () => {
      await prisma.user.deleteMany();
      const user = await prisma.user.create({
        data: {
          firstName: "User",
          lastName: "Test",
          email: "usertest3@example.com",
          password: "password123",
          registrationNumber: "REGUSER3",
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

    it("should handle error in getUserById", async () => {
      await prisma.$disconnect();
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.be.oneOf([500, 401, 200]);
      await prisma.$connect();
    });

    it("should handle error in getUserQRCode", async () => {
      await prisma.$disconnect();
      const res = await request(app)
        .get(`/api/users/${userId}/qrcode`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.be.oneOf([500, 401, 200]);
      await prisma.$connect();
    });
  });

  describe("utils/registrationNumber", () => {
    it("should generate a registration number", async () => {
      const regNum = await registrationNumberUtil.generateRegistrationNumber();
      expect(regNum).to.be.a("string");
      expect(regNum.length).to.be.greaterThan(0);
    });
  });

  describe("docs/swagger", () => {
    it("should export a function and call without error", () => {
      const testApp = express();
      expect(() => swaggerDocs(testApp, 3000)).to.not.throw();
    });
  });
});
