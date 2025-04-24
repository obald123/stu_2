"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRegistrationNumber = generateRegistrationNumber;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function generateRegistrationNumber() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const prefix = `REG${currentYear}`;
        // Find the highest existing registration number with the current prefix
        const lastUser = yield prisma.user.findFirst({
            where: {
                registrationNumber: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                registrationNumber: 'desc',
            },
        });
        let sequenceNumber = 1;
        if (lastUser && lastUser.registrationNumber.startsWith(prefix)) {
            const lastSequence = parseInt(lastUser.registrationNumber.replace(prefix, ''), 10);
            if (!isNaN(lastSequence)) {
                sequenceNumber = lastSequence + 1;
            }
        }
        // Pad with leading zeros to make it 5 digits
        const paddedSequence = sequenceNumber.toString().padStart(5, '0');
        return `${prefix}${paddedSequence}`;
    });
}
