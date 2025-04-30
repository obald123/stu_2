import { expect } from "chai";
import request from "supertest";
import { app } from "../server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

describe("adminController edge/error cases", () => {
  let adminId: string;
  let adminToken: string;
  beforeEach(async () => {
    await prisma.user.deleteMany();
    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "User",
        email: "admin2@example.com",
        password: "password123",
        registrationNumber: "REGADMIN3",
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

  it("should return 400 if updateUser called with no userId", async () => {
    const res = await request(app)
      .put("/api/admin/users/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ firstName: "NewName" });
    expect(res.status).to.be.oneOf([400, 404]);
  });

  it("should return 404 if deleteUser called with non-existent user", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/nonexistentid`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).to.equal(404);
    expect(res.body.message).to.match(/not found/i);
  });

  it("should return 403 if deleteUser called on admin user", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).to.equal(403);
    expect(res.body.message).to.match(/cannot delete admin/i);
  });
});

describe("userController edge/error cases", () => {
  let userId: string;
  let token: string;
  beforeEach(async () => {
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        firstName: "User",
        lastName: "Test",
        email: "usertest2@example.com",
        password: "password123",
        registrationNumber: "REGUSER2",
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

  it("should return 404 if getUserById called with non-existent id", async () => {
    const res = await request(app)
      .get(`/api/users/nonexistentid`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(404);
    expect(res.body.message).to.match(/not found/i);
  });
});

describe("server error handling", () => {
  it("should handle 404 for unknown route", async () => {
    const res = await request(app).get("/api/unknownroute");
    expect(res.status).to.be.oneOf([404, 400, 401]);
  });
});
