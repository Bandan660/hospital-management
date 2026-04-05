import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError }   from '../utils/response';
import { User, UserRole } from '../models/User.model';

// Extend Express Request to carry user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// ✅ Protect — verify JWT token
export const protect = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Unauthorized: No token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Check user still exists and is active
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      sendError(res, 'Unauthorized: User no longer active', 401);
      return;
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      sendError(res, 'Unauthorized: Token expired', 401);
    } else {
      sendError(res, 'Unauthorized: Invalid token', 401);
    }
  }
};

// ✅ Admin only — must come after protect
export const adminOnly = (
  req: Request, res: Response, next: NextFunction
): void => {
  if (req.user?.role !== UserRole.ADMIN) {
    sendError(res, 'Forbidden: Admin access required', 403);
    return;
  }
  next();
};