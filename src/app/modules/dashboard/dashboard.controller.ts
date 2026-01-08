import { Request, Response, NextFunction } from 'express';
import DashboardService from './dashboard.service';

export class DashboardController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getDashboardStats();
      return res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}

export default DashboardController;
