"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const generateToken_1 = require("../utils/generateToken");
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];
            // Verificar token
            const decoded = (0, generateToken_1.verifyToken)(token);
            // Obtener usuario del token
            req.user = await User_1.default.findById(decoded.id).select('-contraseña');
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'No autorizado, usuario no encontrado',
                });
                return;
            }
            if (!req.user.activo) {
                res.status(401).json({
                    success: false,
                    message: 'Usuario inactivo',
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Error en autenticación:', error);
            res.status(401).json({
                success: false,
                message: 'No autorizado, token inválido o expirado',
            });
            return;
        }
    }
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'No autorizado, no se proporcionó token',
        });
        return;
    }
};
exports.protect = protect;
var adminMiddleware_1 = require("./adminMiddleware");
Object.defineProperty(exports, "admin", { enumerable: true, get: function () { return adminMiddleware_1.admin; } });
