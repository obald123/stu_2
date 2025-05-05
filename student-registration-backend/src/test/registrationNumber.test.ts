import { expect } from "chai";
import { PrismaClient } from "@prisma/client";
import * as registrationNumberUtil from "../utils/registrationNumber";

describe("registrationNumber.ts utility", () => {
  const prisma = new PrismaClient();
  
  beforeEach(async function() {
    this.timeout(5000);
    await prisma.user.deleteMany();
  });

  after(async function() {
    this.timeout(5000);
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should generate a registration number with correct prefix and padding", async function() {
    this.timeout(5000);
    const regNum = await registrationNumberUtil.generateRegistrationNumber();
    expect(regNum).to.match(/^REG\d{2}\d{5}$/);
  });

  it("should increment sequence if user with current prefix exists", async function() {
    this.timeout(5000);
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `REG${year}`;
    await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "User",
        email: `testuser${Date.now()}@example.com`,
        password: "password123",
        registrationNumber: `${prefix}00042`,
        dateOfBirth: new Date("2000-01-01"),
        role: "student",
      },
    });
    const regNum = await registrationNumberUtil.generateRegistrationNumber();
    expect(regNum).to.equal(`${prefix}00043`);
  });

  it("should handle concurrent registration number generation", async function() {
    this.timeout(10000);
    const generateMultiple = async () => {
      const promises = Array(5).fill(null).map(() => 
        registrationNumberUtil.generateRegistrationNumber()
      );
      const numbers = await Promise.all(promises);
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).to.equal(numbers.length);
    };

    await Promise.all(Array(3).fill(null).map(() => generateMultiple()));
  });

  it("should handle database connection errors", async function() {
    this.timeout(5000);
    await prisma.$disconnect();
    try {
      await registrationNumberUtil.generateRegistrationNumber();
    } catch (error) {
      expect(error).to.exist;
    } finally {
      await prisma.$connect();
    }
  });
});
