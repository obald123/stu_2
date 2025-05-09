import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logTestResult(testName: string, status: string, error?: string) {
  await prisma.testResult.create({
    data: {
      testName,
      status,
      error: error || null,
    },
  });
}
