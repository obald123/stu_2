"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const authorizeAdmin_1 = __importDefault(require("../middleware/authorizeAdmin"));
const validate_1 = __importDefault(require("../middleware/validate"));
const userValidation_1 = require("../validations/userValidation");
const router = (0, express_1.Router)();
router.use(authenticate_1.default, authorizeAdmin_1.default);
router.get('/users', adminController_1.getAllUsers);
router.put('/users/:id', (0, validate_1.default)(userValidation_1.updateUserSchema), adminController_1.updateUser);
router.delete('/users/:id', adminController_1.deleteUser);
exports.default = router;
