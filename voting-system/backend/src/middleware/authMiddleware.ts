// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/generateToken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = verifyToken(token);

      // Obtener usuario del token
      req.user = await User.findById(decoded.id).select('-contraseña');

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
    } catch (error) {
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

export { admin } from './adminMiddleware';
