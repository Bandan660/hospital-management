import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';
import { sendSuccess, sendError } from '../utils/response';

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await dashboardService.getStats();
    sendSuccess(res, stats, 'Dashboard stats fetched successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};