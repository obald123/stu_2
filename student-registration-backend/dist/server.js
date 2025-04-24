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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
exports.app = (0, express_1.default)();
const port = process.env.PORT || 5005;
exports.app.use((0, cors_1.default)({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
}));
exports.app.use(express_1.default.json());
// Routes
exports.app.use('/api', authRoutes_1.default);
exports.app.use('/api', userRoutes_1.default);
exports.app.use('/api/admin', adminRoutes_1.default);
exports.app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.send('Server is running');
});
exports.app.get('/test', (req, res) => {
    res.send('Test route is working');
});
// Swagger documentation
(0, swagger_1.default)(exports.app, Number(port));
// Error handling middleware
exports.app.use((err, req, res, next) => {
    console.error('--- Express Error Handler ---');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    if (err instanceof Error && err.name) {
        console.error('Name:', err.name);
    }
    if (err.code) {
        console.error('Code:', err.code);
    }
    if (err.meta) {
        console.error('Meta:', err.meta);
    }
    if (err.errors) {
        console.error('Errors:', err.errors);
    }
    console.error('Full error object:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});
// Start server
exports.app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Graceful shutdown
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    process.exit(0);
}));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    process.exit(0);
}));
