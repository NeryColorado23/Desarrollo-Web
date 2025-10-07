import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  rol: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  const options: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRE as any) || '7d',
 };


  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  const decoded = jwt.verify(token, secret) as JwtPayload & TokenPayload;
  return {
    id: decoded.id,
    rol: decoded.rol,
  };
};
