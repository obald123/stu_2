import { expect } from "chai";
import { PrismaClient } from "@prisma/client";
import * as registrationNumberUtil from "../utils/registrationNumber";

describe("registrationNumber.ts utility", () => {
  const prisma = new PrismaClient();
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });
  after(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should generate a registration number with correct prefix and padding", async () => {
    const regNum = await registrationNumberUtil.generateRegistrationNumber();
    expect(regNum).to.match(/^REG\d{2}\d{5}$/);
  });

  it("should increment sequence if user with current prefix exists", async () => {
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
});
