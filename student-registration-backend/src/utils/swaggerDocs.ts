export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Student Registration API",
    version: "1.0.0",
    description: "API for student registration system",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterUser: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          dateOfBirth: { type: "string", format: "date" },
        },
        required: ["firstName", "lastName", "email", "password", "dateOfBirth"],
      },
      LoginUser: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
      UpdateUser: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string", format: "email" },
          registrationNumber: { type: "string" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/register": {
      post: {
        summary: "Register a new student",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterUser" },
            },
          },
        },
        responses: {
          201: { description: "Student registered successfully" },
          400: { description: "Bad request" },
        },
      },
    },
    "/api/login": {
      post: {
        summary: "Login a user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginUser" },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          400: { description: "Bad request" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/profile": {
      get: {
        summary: "Get the authenticated user's profile",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User profile data" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/user/{id}/qrcode": {
      get: {
        summary: "Get a QR code for a user's name, email, and registration number",
        tags: ["User"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "QR code image",
            content: {
              "image/png": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          404: { description: "User not found" },
        },
      },
    },
    "/api/user/{id}/qrcode/test": {
      get: {
        summary: "Test QR code generation for a user (returns sample QR code)",
        tags: ["User"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "User ID (use a valid or sample ID)",
          },
        ],
        responses: {
          200: {
            description: "Sample QR code image for testing",
            content: {
              "image/png": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          404: { description: "User not found" },
        },
      },
    },
    "/api/admin/users": {
      get: {
        summary: "Get all users (admin only)",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer" }, description: "Page number" },
          { in: "query", name: "limit", schema: { type: "integer" }, description: "Number of users per page" },
        ],
        responses: {
          200: { description: "List of users" },
          401: { description: "Unauthorized" },
          403: { description: "Admin access required" },
        },
      },
    },
    "/api/admin/users/{id}": {
      put: {
        summary: "Update a user (admin only)",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "string" }, description: "User ID" },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUser" },
            },
          },
        },
        responses: {
          200: { description: "User updated successfully" },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
          403: { description: "Admin access required" },
        },
      },
      delete: {
        summary: "Delete a user (admin only)",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "string" }, description: "User ID" },
        ],
        responses: {
          200: { description: "User deleted successfully" },
          401: { description: "Unauthorized" },
          403: { description: "Admin access required" },
        },
      },
    },
    "/api/admin/analytics": {
      get: {
        summary: "Get user analytics (admin only)",
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "User analytics data" },
          401: { description: "Unauthorized" },
          403: { description: "Admin access required" },
        },
      },
    },
  },
};
