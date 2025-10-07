"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const admin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador',
        });
    }
};
exports.admin = admin;
