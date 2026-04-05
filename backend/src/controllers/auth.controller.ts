import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      sendError(res, 'name, email, password are required', 400);
      return;
    }

    const result = await authService.register({ name, email, password, role });
    sendSuccess(res, result, 'Admin registered successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'email and password are required', 400);
      return;
    }

    const result = await authService.login({ email, password });
    sendSuccess(res, result, 'Login successful');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.getProfile(req.user!.id);
    sendSuccess(res, user, 'Profile fetched');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};