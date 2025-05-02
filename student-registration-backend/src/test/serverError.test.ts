import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe('Server Error Handling', () => {
  let server: any;

  before(() => {
    server = startServer();
  });

  after(async () => {
    stopServer();
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  it('should handle errors with custom error middleware', async () => {
    app.get('/test-error', () => {
      const error = new Error('Test error');
      error.name = 'Error';
      throw error;
    });

    const response = await request(app).get('/test-error');
    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ error: 'Internal Server Error' });
  });

  it('should handle Prisma errors', async () => {
    app.get('/test-prisma-error', () => {
      const error: any = new Error('Prisma error');
      error.code = 'P2002';
      throw error;
    });

    const response = await request(app).get('/test-prisma-error');
    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ error: 'Internal Server Error' });
  });

  it('should handle validation errors', async () => {
    app.get('/test-validation-error', () => {
      const error: any = new Error('Validation error');
      error.name = 'ValidationError';
      throw error;
    });

    const response = await request(app).get('/test-validation-error');
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ error: 'Internal Server Error' });
  });
});
