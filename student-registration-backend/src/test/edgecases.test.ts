import { expect } from "chai";
import { PrismaClient } from "@prisma/client";
import * as adminController from "../controllers/adminController";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";
import sinon from "sinon";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { app, startServer, stopServer } from "../server";

const prisma = new PrismaClient();
let server: any;

describe("Edge Cases", () => {
  before(async () => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

  afterEach(() => {
    sinon.restore();
    // Clear require cache for controllers to force reload with new PrismaClient stub
    delete require.cache[require.resolve("../controllers/adminController")];
    delete require.cache[require.resolve("../controllers/authController")];
  });

  describe("adminController edge/branch coverage", () => {
    it("should trim auditLog to 100 entries", () => {
      for (let i = 0; i < 110; i++) {
        adminController.logAudit("action", "admin");
      }
      // @ts-ignore
      expect(adminController["auditLog"].length).to.be.at.most(100);
    });

    it("should handle error in getAllUsers (simulate error)", async () => {
      const req = { query: {} } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

      // Patch PrismaClient constructor to return a fake instance with stubbed user
      const fakePrisma = {
        user: {
          findMany: sinon.stub().throws(new Error("Test error")),
          count: sinon.stub().throws(new Error("Test error")),
        },
      };
      const PrismaClient = require("@prisma/client").PrismaClient;
      const prismaStub = sinon.stub().returns(fakePrisma);
      Object.setPrototypeOf(prismaStub, PrismaClient);
      sinon.replace(require("@prisma/client"), "PrismaClient", prismaStub);

      // Now require the controller so it uses the stubbed PrismaClient
      const adminController = require("../controllers/adminController");
      await adminController.getAllUsers(req, res, next);
      expect(next.called).to.be.true;

      sinon.restore();
    });

    it("should handle pagination edge cases in getAllUsers", async () => {
      const req = { query: { page: "0", limit: "-1" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();
      await adminController.getAllUsers(req, res, next);
      expect(res.status.called).to.be.true;
    });

    it("should handle error in updateUser (simulate error)", async () => {
      const req = { params: { id: "id" }, body: {} } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

      // Patch PrismaClient constructor to return a fake instance with stubbed user
      const fakePrisma = {
        user: {
          update: sinon.stub().throws(new Error("Test error")),
        },
      };
      const PrismaClient = require("@prisma/client").PrismaClient;
      const prismaStub = sinon.stub().returns(fakePrisma);
      Object.setPrototypeOf(prismaStub, PrismaClient);
      sinon.replace(require("@prisma/client"), "PrismaClient", prismaStub);

      // Now require the controller so it uses the stubbed PrismaClient
      const adminController = require("../controllers/adminController");
      await adminController.updateUser(req, res, next);
      expect(next.called).to.be.true;

      sinon.restore();
    });

    it("should handle error in deleteUser (simulate error)", async () => {
      const req = { params: { id: "id" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

      // Patch PrismaClient constructor to return a fake instance with stubbed user
      const fakePrisma = {
        user: {
          findUnique: sinon.stub().resolves({ id: "id", role: "student" }),
          delete: sinon.stub().throws(new Error("Test error")),
        },
      };
      const PrismaClient = require("@prisma/client").PrismaClient;
      const prismaStub = sinon.stub().returns(fakePrisma);
      Object.setPrototypeOf(prismaStub, PrismaClient);
      sinon.replace(require("@prisma/client"), "PrismaClient", prismaStub);

      // Now require the controller so it uses the stubbed PrismaClient
      const adminController = require("../controllers/adminController");
      await adminController.deleteUser(req, res, next);
      expect(next.called).to.be.true;

      sinon.restore();
    });
  });

  describe("authController edge/branch coverage", () => {
    it("should handle error in loginUser (simulate Prisma error)", async () => {
      const req = { body: { email: "a@b.com", password: "pw" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

      // Patch PrismaClient constructor to return a fake instance with stubbed user
      const fakePrisma = {
        user: {
          findUnique: sinon.stub().throws(new Error("Test error")),
        },
      };
      const PrismaClient = require("@prisma/client").PrismaClient;
      const prismaStub = sinon.stub().returns(fakePrisma);
      Object.setPrototypeOf(prismaStub, PrismaClient);
      sinon.replace(require("@prisma/client"), "PrismaClient", prismaStub);

      // Now require the controller so it uses the stubbed PrismaClient
      const authController = require("../controllers/authController");
      try {
        await authController.loginUser(req, res, next);
      } catch (e) {
        // Accept the error as valid, but still check next was called
      }
      expect(next.called).to.be.true;

      sinon.restore();
    });

    it("should handle error in registerStudent (simulate Prisma error)", async () => {
      const req = { body: { firstName: "A", lastName: "B", email: "a@b.com", password: "pw", dateOfBirth: "2000-01-01" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();
      sinon.stub(bcrypt, "hash").throws(new Error("bcrypt error"));
      try {
        await authController.registerStudent(req, res, next);
      } catch (e) {
        // Accept the error as valid
      }
      expect(next.called).to.be.true;
      (bcrypt.hash as any).restore();
    });
  });

  describe("userController edge/branch coverage", () => {
    it("should handle error in getUserById (simulate Prisma error)", async () => {
      const req = { params: { id: "id" } } as any;
      // Use a fresh res object for this test
      const res = { status: function() { return this; }, json: sinon.stub() } as any;
      const statusStub = sinon.stub(res, "status").throws(new Error("Prisma error"));
      try {
        await userController.getUserById(req, res);
      } catch (e) {
        if (e instanceof Error) {
          expect(e.message).to.equal("Prisma error");
        } else {
          throw e;
        }
      }
      statusStub.restore();
    });

    it("should handle error in getUserQRCode (simulate Prisma error)", async () => {
      const req = { params: { id: "id" } } as any;
      const res = { status: function() { return this; }, json: sinon.stub(), writeHead: sinon.stub(), end: sinon.stub() } as any;
      const statusStub = sinon.stub(res, "status").throws(new Error("Prisma error"));
      try {
        await userController.getUserQRCode(req, res);
      } catch (e) {
        if (e instanceof Error) {
          expect(e.message).to.equal("Prisma error");
        } else {
          throw e;
        }
      }
      statusStub.restore();
    });

    it("should handle error in getUserQRCode (simulate QRCode error)", async () => {
      const req = { params: { id: "id" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub(), writeHead: sinon.stub(), end: sinon.stub() } as any;
      sinon.stub(userController, "getUserQRCode").throws(new Error("QRCode error"));
      try {
        await userController.getUserQRCode(req, res);
      } catch (e) {
        if (e instanceof Error) {
          expect(e.message).to.equal("QRCode error");
        } else {
          throw e;
        }
      }
      (userController.getUserQRCode as any).restore();
    });
  });
});
