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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerStudent = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const registrationNumber_1 = require("../utils/registrationNumber");
const prisma = new client_1.PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
const registerStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, dateOfBirth } = req.body;
        // Check if user already exists
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Generate registration number
        const registrationNumber = yield (0, registrationNumber_1.generateRegistrationNumber)();
        // Create new user
        const newUser = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                registrationNumber,
                dateOfBirth: new Date(dateOfBirth),
                role: 'student',
            },
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, role: newUser.role }, jwtSecret, { expiresIn: '1h' });
        res.status(201).json({
            message: 'Student registered successfully',
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                registrationNumber: newUser.registrationNumber,
                role: newUser.role,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerStudent = registerStudent;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = user && (yield bcryptjs_1.default.compare(password, user.password));
        if (!user || !isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                registrationNumber: user.registrationNumber,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
