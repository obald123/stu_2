import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";
import { logTestResult } from "../utils/logTestResult";
import jwt from "jsonwebtoken";
import sinon from "sinon";
import bcrypt from "bcryptjs";

// Define your JWT secret for testing purposes
const jwtSecret = "test_jwt_secret";

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

    it("should return 400 if firstName is missing", async () => {
      const res = await request(app).post("/api/register").send({
        lastName: "Doe",
        email: "missing@ex.com",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors.some((e: { path: (string | number)[]; message: string; }) =>
          e.path.includes('firstName') &&
          /required|min|least|string/i.test(e.message)
        )
      ).to.be.true;
    });

    it("should return 400 if email is invalid", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "not-an-email",
        password: "password123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors.some((e: { path: (string | number)[]; message: string; }) =>
          e.path.includes('email') &&
          /email|invalid/i.test(e.message)
        )
      ).to.be.true;
    });

    it("should return 400 if password is too short", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "short@ex.com",
        password: "123",
        dateOfBirth: "2000-01-01",
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors.some((e: { path: (string | number)[]; message: string; }) =>
          e.path.includes('password') &&
          /password|min|least|string/i.test(e.message)
        )
      ).to.be.true;
    });

    it("should return 400 if dateOfBirth is invalid format", async () => {
      const res = await request(app).post("/api/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "date@ex.com",
        password: "password123",
        dateOfBirth: "01-01-2000",  // Wrong format
      });
      expect(res.status).to.equal(400);
      expect(
        res.body.errors.some((e: { path: (string | number)[]; message: string; }) =>
          e.path.includes('dateOfBirth') &&
          /date|invalid|format/i.test(e.message)
        )
      ).to.be.true;
    });
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

      // Verify token is valid
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET || jwtSecret);
      expect(decoded).to.have.property("email", "john.doe@example.com");
    }));

    it("should return 401 with invalid password", logResultWrapper("should return 401 with invalid password", async () => {
      const res = await request(app).post("/api/login").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Invalid credentials");
    }));

    it("should return 401 with non-existent email", logResultWrapper("should return 401 with non-existent email", async () => {
      const res = await request(app).post("/api/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Invalid credentials");
    }));

    it("should return 400 with missing email", logResultWrapper("should return 400 with missing email", async () => {
      const res = await request(app).post("/api/login").send({
        password: "password123",
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.exist;
    }));

    it("should return 400 with missing password", logResultWrapper("should return 400 with missing password", async () => {
      const res = await request(app).post("/api/login").send({
        email: "john.doe@example.com",
      });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.exist;
    }));

    it("should return correct user role in token", logResultWrapper("should return correct user role in token", async () => {
      const res = await request(app).post("/api/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(res.status).to.equal(200);
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET || jwtSecret);
      expect(decoded).to.have.property("role", "student");
    }));
  });
});

describe('Authentication Edge Cases', () => {
  let server: any;

  before(() => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('Student Registration Edge Cases', () => {
    it('should handle registration with existing email', async () => {
      // First create a user
      await prisma.user.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
          registrationNumber: 'TEST001',
          dateOfBirth: new Date('2000-01-01'),
          role: 'student'
        }
      });

      const res = await request(app)
        .post('/api/register')
        .send({
          firstName: 'Another',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password456',
          dateOfBirth: '2000-01-01'
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Email already in use');
    });
  });

  describe('Password Tests', () => {
    it('should handle password validation failure', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'weak',
          dateOfBirth: '2000-01-01'
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Password must be at least 6 characters');
    });
  });

  describe('Login Edge Cases', () => {
    it('should handle login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Invalid credentials');
    });
  });

  describe('Token Validation', () => {
    it('should handle expired tokens', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-id', role: 'student' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '0s' }
      );

      const res = await request(app)
        .get('/api/verify')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Token has expired');
    });
  });
});

describe('Auth Controller Password Tests', () => {
  it('should handle password validation failure', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'weak', // too short password
        dateOfBirth: '2000-01-01'
      });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Password must be at least 6 characters');
  });

  it('should handle expired tokens', async () => {
    const expiredToken = jwt.sign(
      { userId: 'test-id', role: 'student' },
      jwtSecret,
      { expiresIn: '0s' }
    );

    const res = await request(app)
      .get('/api/verify')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).to.equal(401);
    expect(res.body.message).to.match(/expired/i);
  });
});

describe('Auth Controller Edge Cases', () => {
  describe('Password and Token Validation', () => {
    it('should validate password complexity requirements', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'short',  // Too short password
          dateOfBirth: '2000-01-01'
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Password must be at least 6 characters');
    });

    it('should handle token verification with expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-id', role: 'student' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '0s' }
      );

      const res = await request(app)
        .get('/api/verify')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).to.equal(401);
    });
  });

  it('should handle password validation failure', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'weak',
        dateOfBirth: '2000-01-01'
      });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Password must be at least 6 characters');
  });

  it('should handle login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Invalid credentials');
  });

  it('should handle login with incorrect password', async () => {
    // First create a user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: hashedPassword,
        registrationNumber: 'TEST001',
        dateOfBirth: new Date('2000-01-01'),
        role: 'student'
      }
    });

    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Invalid credentials');
  });

  describe('Token Validation', () => {
    it('should handle expired tokens', async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: 'test-id', role: 'student' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '0s' }
      );

      const res = await request(app)
        .get('/api/verify')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Token has expired');
    });
  });
});

describe("Login Rate Limiting", () => {
  let clock: sinon.SinonFakeTimers;
  
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.create({
      data: {
        firstName: "Rate",
        lastName: "Limited",
        email: "rate.test@example.com",
        password: hashedPassword,
        registrationNumber: "REG777777",
        dateOfBirth: new Date("2000-01-01"),
        role: "student",
      },
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    clock.restore();
  });

  it("should block after multiple failed attempts", async () => {
    const loginAttempts = Array(5).fill(null).map(() => 
      request(app)
        .post("/api/login")
        .send({
          email: "rate.test@example.com",
          password: "wrongpassword"
        })
    );

    // Make multiple failed attempts in parallel
    const results = await Promise.all(loginAttempts);
    results.forEach(res => {
      expect(res.status).to.equal(401);
    });

    // Next attempt should be rate limited
    const blockedRes = await request(app)
      .post("/api/login")
      .send({
        email: "rate.test@example.com",
        password: "wrongpassword"
      });

    expect(blockedRes.status).to.equal(429);
    expect(blockedRes.body.message).to.include("Too many login attempts");
  }).timeout(10000);

  it("should allow login after rate limit window expires", async () => {
    // Make failed attempts
    const loginAttempts = Array(5).fill(null).map(() => 
      request(app)
        .post("/api/login")
        .send({
          email: "rate.test@example.com",
          password: "wrongpassword"
        })
    );

    await Promise.all(loginAttempts);

    // Advance time by 15 minutes
    clock.tick(15 * 60 * 1000);

    // Should now be able to attempt login again
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "rate.test@example.com",
        password: "password123"
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Login successful");
  }).timeout(10000);
});

describe("Authentication Tests", () => {
  describe("Forgot Password Functionality", () => {
    it("should send reset token for valid email", async () => {
      // Create a test user first
      const hashedPassword = await bcrypt.hash("password123", 10);
      await prisma.user.create({
        data: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          password: hashedPassword,
          registrationNumber: "TEST001",
          dateOfBirth: new Date("2000-01-01"),
          role: "student"
        }
      });

      const res = await request(app)
        .post("/api/forgot-password")
        .send({
          email: "test@example.com"
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message");
      expect(res.body).to.have.property("token");
      expect(typeof res.body.token).to.equal("string");
    });

    it("should handle non-existent email securely", async () => {
      const res = await request(app)
        .post("/api/forgot-password")
        .send({
          email: "nonexistent@example.com"
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.include("If an account exists");
      expect(res.body).to.not.have.property("token");
    });
  });

  describe("Reset Password Functionality", () => {
    it("should reset password with valid token", async () => {
      // Create a test user
      const user = await prisma.user.create({
        data: {
          firstName: "Reset",
          lastName: "Test",
          email: "reset@example.com",
          password: await bcrypt.hash("oldpassword", 10),
          registrationNumber: "RESET001",
          dateOfBirth: new Date("2000-01-01"),
          role: "student"
        }
      });

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, purpose: "password_reset" },
        jwtSecret,
        { expiresIn: "1h" }
      );

      const res = await request(app)
        .post(`/api/reset-password/${resetToken}`)
        .send({
          password: "newpassword123",
          confirmPassword: "newpassword123"
        });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Password updated successfully");

      // Verify new password works
      const loginRes = await request(app)
        .post("/api/login")
        .send({
          email: "reset@example.com",
          password: "newpassword123"
        });

      expect(loginRes.status).to.equal(200);
    });

    it("should handle expired reset token", async () => {
      const expiredToken = jwt.sign(
        { userId: "test-id", purpose: "password_reset" },
        jwtSecret,
        { expiresIn: 0 }
      );

      const res = await request(app)
        .post(`/api/reset-password/${expiredToken}`)
        .send({
          password: "newpassword123",
          confirmPassword: "newpassword123"
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Reset token has expired");
    });
  });

  describe("Keep Me Signed In Functionality", () => {
    it("should issue long-lived token when keepSignedIn is true", async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash("password123", 10);
      await prisma.user.create({
        data: {
          firstName: "Keep",
          lastName: "SignedIn",
          email: "keep@example.com",
          password: hashedPassword,
          registrationNumber: "KEEP001",
          dateOfBirth: new Date("2000-01-01"),
          role: "student"
        }
      });

      const res = await request(app)
        .post("/api/login")
        .send({
          email: "keep@example.com",
          password: "password123",
          keepSignedIn: true
        });

      expect(res.status).to.equal(200);
      const token = res.body.token;
      const decoded = jwt.decode(token) as { exp: number };
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      
      // Should be close to 30 days (with some margin for test execution time)
      expect(expiresIn).to.be.closeTo(30 * 24 * 60 * 60, 60);
    });

    it("should issue short-lived token when keepSignedIn is false", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          email: "keep@example.com",
          password: "password123",
          keepSignedIn: false
        });

      expect(res.status).to.equal(200);
      const token = res.body.token;
      const decoded = jwt.decode(token) as { exp: number };
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      
      // Should be close to 1 hour (with some margin for test execution time)
      expect(expiresIn).to.be.closeTo(60 * 60, 60);
    });
  });
});
