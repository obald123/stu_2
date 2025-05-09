import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  role: z.enum(['admin', 'student']).optional(),
});

export const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  autoApproveRegistrations: z.boolean(),
  maxStudentsPerClass: z.number().int().min(1).max(100),
  registrationPrefix: z.string().min(2).max(5),
  maintenanceMode: z.boolean(),
});