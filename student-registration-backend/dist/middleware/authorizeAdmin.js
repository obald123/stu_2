"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
exports.default = authorizeAdmin;
