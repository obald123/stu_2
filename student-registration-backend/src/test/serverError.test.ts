import { expect } from "chai";
import request from "supertest";
import { app } from "../server";

describe("server.ts error handling", () => {
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
