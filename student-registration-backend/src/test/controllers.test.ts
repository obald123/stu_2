import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { updateUser, deleteUser, getAllUsers, getAnalytics } from "../controllers/adminController";
import sinon from "sinon";
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
let server: any;

describe("adminController edge/error cases", () => {
  let adminId: string;
  let adminToken: string;

  before(async () => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

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

  before(async () => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

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
  before(async () => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

  it("should handle 404 for unknown route", async () => {
    const res = await request(app).get("/api/unknownroute");
    expect(res.status).to.be.oneOf([404, 400, 401]);
  });
});

describe('Admin Controller Tests', () => {
  let mockPrisma: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: sinon.stub(),
        findMany: sinon.stub(),
        update: sinon.stub(),
        delete: sinon.stub(),
        count: sinon.stub(),
      },
    };
    req = {
      params: {},
      body: {},
      user: { id: 'admin-id' },
      query: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub() as unknown as NextFunction;
  });

  describe('updateUser', () => {
    it('should handle database errors', async () => {
      req.params = { id: 'invalid-id' };
      req.body = { firstName: 'Test' };
      mockPrisma.user.update.rejects(new Error('Database error'));
      
      await updateUser(req as Request, res as Response, next);
      
      sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
      sinon.assert.calledWith(res.json as sinon.SinonStub, { message: 'Database error' });
    });
  });

  describe('Analytics and User Management', () => {
    it('should handle errors in getAnalytics', async () => {
      mockPrisma.user.count.rejects(new Error('Database error'));
      await getAnalytics(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
      sinon.assert.calledWith(res.json as sinon.SinonStub, { message: 'Database error' });
    });

    it('should handle invalid date range in analytics', async () => {
      req.query = {
        startDate: 'invalid-date',
        endDate: '2025-05-01'
      };
      await getAnalytics(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledWith(res.json as sinon.SinonStub, { message: 'Invalid date format' });
    });

    it('should handle pagination errors in getAllUsers', async () => {
      req.query = {
        page: 'invalid',
        limit: 'invalid'
      };
      await getAllUsers(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledWith(res.json as sinon.SinonStub, { message: 'Invalid pagination parameters' });
    });
  });
});

describe('Admin Analytics and Error Handling', () => {
  let mockPrisma: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockPrisma = {
      user: {
        count: sinon.stub(),
        findMany: sinon.stub(),
        findUnique: sinon.stub(),
        update: sinon.stub(),
        delete: sinon.stub(),
      },
    };
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub() as unknown as NextFunction;
  });

  it('should handle errors in getAnalytics', async () => {
    const mockError = new Error('Database error');
    mockPrisma.user.count.rejects(mockError);
    await getAnalytics(req as Request, res as Response, next);
    sinon.assert.called(next as sinon.SinonStub);
  });

  it('should handle invalid date range in analytics', async () => {
    req.query = {
      startDate: 'invalid-date',
      endDate: '2025-05-01'
    };
    await getAnalytics(req as Request, res as Response, next);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
  });

  it('should handle getAllUsers database error', async () => {
    mockPrisma.user.findMany.rejects(new Error('Database error'));
    await getAllUsers(req as Request, res as Response, next);
    sinon.assert.called(next as sinon.SinonStub);
  });

  it('should handle pagination errors in getAllUsers', async () => {
    req.query = {
      page: 'invalid',
      limit: 'invalid'
    };
    await getAllUsers(req as Request, res as Response, next);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
  });

  it('should handle invalid update data in updateUser', async () => {
    req.params = { id: 'valid-id' };
    req.body = { invalidField: 'test' };
    await updateUser(req as Request, res as Response, next);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
  });
  it('should handle specific date range analytics', async () => {
    req.query = {
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    };
    mockPrisma.user.count.resolves(10);
    await getAnalytics(req as Request, res as Response, next);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
  });

  it('should handle specific pagination parameters', async () => {
    req.query = {
      page: '2',
      limit: '10',
      search: 'test'
    };
    mockPrisma.user.findMany.resolves([]);
    mockPrisma.user.count.resolves(15);
    await getAllUsers(req as Request, res as Response, next);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
  });

  it('should handle user update with specific fields', async () => {
    req.params = { id: 'valid-id' };
    req.body = {
      firstName: 'Updated',
      lastName: 'User',
      email: 'updated@example.com'
    };
    mockPrisma.user.update.resolves({
      id: 'valid-id',
      ...req.body
    });
    await updateUser(req as Request, res as Response, next);
    sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
  });
});
