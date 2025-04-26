import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateRegistrationNumber(): Promise<string> {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const prefix = `REG${currentYear}`;

  // Find the highest existing registration number with the current prefix
  const lastUser = await prisma.user.findFirst({
    where: {
      registrationNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      registrationNumber: "desc",
    },
  });

  let sequenceNumber = 1;

  if (lastUser && lastUser.registrationNumber.startsWith(prefix)) {
    const lastSequence = parseInt(
      lastUser.registrationNumber.replace(prefix, ""),
      10,
    );
    if (!isNaN(lastSequence)) {
      sequenceNumber = lastSequence + 1;
    }
  }

  // Pad with leading zeros to make it 5 digits
  const paddedSequence = sequenceNumber.toString().padStart(5, "0");

  return `${prefix}${paddedSequence}`;
}
