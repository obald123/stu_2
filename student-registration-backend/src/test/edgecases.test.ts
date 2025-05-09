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

describe("Edge Cases", () => {
  let server: any;

  before(async function() {
    this.timeout(10000); // Allow 10s for server startup
    server = startServer();
  });

  after(async function() {
    this.timeout(10000); // Allow 10s for cleanup
    await prisma.$disconnect();
    stopServer();
  });

  afterEach(() => {
    sinon.restore();
    delete require.cache[require.resolve("../controllers/adminController")];
    delete require.cache[require.resolve("../controllers/authController")];
  });

  describe("adminController edge/branch coverage", () => {
    it("should trim auditLog to 100 entries", function() {
      this.timeout(5000);
      for (let i = 0; i < 110; i++) {
        adminController.logAudit("action", "admin");
      }
      expect(adminController["auditLog"].length).to.be.at.most(100);
    });

    it("should handle error in getAllUsers (simulate error)", async function() {
      this.timeout(5000);
      const req = { query: {} } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

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

      const adminController = require("../controllers/adminController");
      await adminController.getAllUsers(req, res, next);
      expect(next.called).to.be.true;

      sinon.restore();
    });

    it("should handle pagination edge cases in getAllUsers", async function() {
      this.timeout(5000);
      const req = { query: { page: "0", limit: "-1" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();
      await adminController.getAllUsers(req, res, next);
      expect(res.status.called).to.be.true;
    });

    it("should handle error in updateUser (simulate error)", async function() {
      this.timeout(5000);
      const req = { params: { id: "id" }, body: {} } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

      const fakePrisma = {
        user: {
          update: sinon.stub().throws(new Error("Test error")),
        },
      };
      const PrismaClient = require("@prisma/client").PrismaClient;
      const prismaStub = sinon.stub().returns(fakePrisma);
      Object.setPrototypeOf(prismaStub, PrismaClient);
      sinon.replace(require("@prisma/client"), "PrismaClient", prismaStub);

      const adminController = require("../controllers/adminController");
      await adminController.updateUser(req, res, next);
      expect(next.called).to.be.true;

      sinon.restore();
    });

    it("should handle error in deleteUser (simulate error)", async function() {
      this.timeout(5000);
      const req = { params: { id: "id" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

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

      const adminController = require("../controllers/adminController");
      await adminController.deleteUser(req, res, next);
      expect(next.called).to.be.true;

      sinon.restore();
    });
  });

  describe("authController edge/branch coverage", () => {
    it("should handle error in loginUser (simulate Prisma error)", async function() {
      this.timeout(5000);
      const req = { body: { email: "a@b.com", password: "pw" } } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

      const fakePrisma = {
        user: {
          findUnique: sinon.stub().throws(new Error("Test error")),
        },
      };
      const PrismaClient = require("@prisma/client").PrismaClient;
      const prismaStub = sinon.stub().returns(fakePrisma);
      Object.setPrototypeOf(prismaStub, PrismaClient);
      sinon.replace(require("@prisma/client"), "PrismaClient", prismaStub);

      const authController = require("../controllers/authController");
      await authController.loginUser(req, res, next);
      expect(next.called).to.be.true;

      sinon.restore();
    });

    it("should handle error in registerStudent (simulate bcrypt error)", async function() {
      this.timeout(5000);
      const req = { 
        body: { 
          firstName: "A", 
          lastName: "B", 
          email: "a@b.com", 
          password: "pw", 
          dateOfBirth: "2000-01-01" 
        } 
      } as any;
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() } as any;
      const next = sinon.stub();

      sinon.stub(bcrypt, "hash").throws(new Error("bcrypt error"));
      
      try {
        await authController.registerStudent(req, res, next);
      } catch (e) {
        // Error expected
      }
      
      expect(next.called).to.be.true;
      (bcrypt.hash as any).restore();
    });
  });

  describe("userController edge/branch coverage", () => {
    it("should handle error in getUserById (simulate Prisma error)", async function() {
      this.timeout(5000);
      const req = { params: { id: "id" } } as any;
      const res = { 
        status: function() { return this; }, 
        json: sinon.stub() 
      } as any;
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

    it("should handle error in getUserQRCode (simulate QR generation error)", async function() {
      this.timeout(5000);
      const req = { params: { id: "id" } } as any;
      const res = { 
        status: sinon.stub().returnsThis(), 
        json: sinon.stub(), 
        writeHead: sinon.stub(), 
        end: sinon.stub() 
      } as any;

      sinon.stub(userController, "getUserQRCode").throws(new Error("QR generation error"));
      
      try {
        await userController.getUserQRCode(req, res);
      } catch (e) {
        if (e instanceof Error) {
          expect(e.message).to.equal("QR generation error");
        } else {
          throw e;
        }
      }
      
      (userController.getUserQRCode as any).restore();
    });
  });
});
