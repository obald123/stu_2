"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters').optional(),
        lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters').optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        dateOfBirth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID'),
    }),
});
