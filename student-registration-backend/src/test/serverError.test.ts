import { expect } from "chai";
import request from "supertest";
import { app, startServer, stopServer } from "../server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe('Server Error Handling', () => {
  let server: any;

  before(async function() {
    this.timeout(10000); // Allow 10s for server startup
    server = startServer();
  });

  after(async function() {
    this.timeout(10000); // Allow 10s for cleanup
    stopServer();
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  it('should handle errors with custom error middleware', async function() {
    this.timeout(5000);
    app.get('/test-error', () => {
      const error = new Error('Test error');
      error.name = 'Error';
      throw error;
    });

    const response = await request(app).get('/test-error');
    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ error: 'Internal Server Error' });
  });

  it('should handle Prisma errors', async function() {
    this.timeout(5000);
    app.get('/test-prisma-error', () => {
      const error: any = new Error('Prisma error');
      error.code = 'P2002';
      throw error;
    });

    const response = await request(app).get('/test-prisma-error');
    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ 
      error: 'Database Error',
      message: 'An error occurred while accessing the database'
    });
  });

  it('should handle validation errors', async function() {
    this.timeout(5000);
    app.get('/test-validation-error', () => {
      const error: any = new Error('Validation error');
      error.name = 'ValidationError';
      error.errors = [{ message: 'Invalid input' }];
      throw error;
    });

    const response = await request(app).get('/test-validation-error');
    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      error: 'Validation Error',
      message: 'Validation error',
      errors: [{ message: 'Invalid input' }]
    });
  });

  it('should handle JWT errors', async function() {
    this.timeout(5000);
    app.get('/test-jwt-error', () => {
      const error: any = new Error('Token expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    const response = await request(app).get('/test-jwt-error');
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({
      error: 'Authentication Error',
      message: 'Token expired'
    });
  });
});
