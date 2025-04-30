import { expect } from "chai";
import request from "supertest";
import express from "express";
import swaggerDocs from "../docs/swagger";
import { openApiSpec } from "../docs/swaggerDocs";

describe("swagger.ts", () => {
  it("should set up /api-docs and /api-docs.json endpoints", async () => {
    const app = express();
    swaggerDocs(app, 3000);
    // Test /api-docs.json returns the OpenAPI spec
    const res = await request(app).get("/api-docs.json");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(openApiSpec);
  });
});
