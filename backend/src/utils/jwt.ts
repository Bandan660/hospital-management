import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET      = process.env.JWT_SECRET || 'fallback_secret_change_in_prod';
const EXPIRES_IN  = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};