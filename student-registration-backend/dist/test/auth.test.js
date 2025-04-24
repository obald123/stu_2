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
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('Auth API', () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up database before tests
        yield prisma.user.deleteMany();
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up database after tests
        yield prisma.user.deleteMany();
        yield prisma.$disconnect();
    }));
    describe('POST /api/register', () => {
        it('should register a new student', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post('/api/register')
                .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                dateOfBirth: '2000-01-01',
            });
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Student registered successfully');
            (0, chai_1.expect)(res.body.user).to.have.property('email', 'john.doe@example.com');
            (0, chai_1.expect)(res.body.user.role).to.equal('student');
            (0, chai_1.expect)(res.body).to.have.property('token');
        }));
        it('should fail with duplicate email', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post('/api/register')
                .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                dateOfBirth: '2000-01-01',
            });
            (0, chai_1.expect)(res.status).to.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Email already in use');
        }));
    });
    describe('POST /api/login', () => {
        it('should login with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post('/api/login')
                .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Login successful');
            (0, chai_1.expect)(res.body.user).to.have.property('email', 'john.doe@example.com');
            (0, chai_1.expect)(res.body).to.have.property('token');
        }));
        it('should fail with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post('/api/login')
                .send({
                email: 'john.doe@example.com',
                password: 'wrongpassword',
            });
            (0, chai_1.expect)(res.status).to.equal(401);
            (0, chai_1.expect)(res.body).to.have.property('message', 'Invalid credentials');
        }));
    });
});
