import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

// ── 404 Handler — unknown routes ─────────────────────
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};

// ── Global Error Handler ──────────────────────────────
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.error(`   Status  : ${err.status || 500}`);
  console.error(`   Message : ${err.message}`);
  if (err.stack) console.error(`   Stack   : ${err.stack}`);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e: any) => e.message).join(', ');
    sendError(res, messages, 400);
    return;
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e: any) => e.message).join(', ');
    sendError(res, messages, 409);
    return;
  }

  // Sequelize connection error
  if (err.name === 'SequelizeConnectionError') {
    sendError(res, 'Database connection failed', 503);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') { sendError(res, 'Invalid token', 401);  return; }
  if (err.name === 'TokenExpiredError') { sendError(res, 'Token expired', 401);  return; }

  // Known operational errors (thrown manually in services)
  if (err.status) {
    sendError(res, err.message, err.status);
    return;
  }

  // Unknown/unexpected errors
  sendError(res, 'Internal Server Error', 500);
};