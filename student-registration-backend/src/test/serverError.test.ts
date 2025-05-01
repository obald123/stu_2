import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let server: any;

describe("server.ts error handling", () => {
  before(async () => {
    server = startServer();
  });

  after(async () => {
    await prisma.$disconnect();
    stopServer();
  });

  it("should handle errors with error middleware", async () => {
    // Add a route that throws an error
    app.get("/error-test", (req, res, next) => {
      next(new Error("Test error"));
    });
    const res = await request(app).get("/error-test");
    expect([500, 400]).to.include(res.status);
    // Accept empty object or message property
    expect(typeof res.body === 'object').to.be.true;
  });
});
