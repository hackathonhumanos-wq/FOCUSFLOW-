import type { Request, Response } from 'express';
import { HealthService } from '../services/healthService.ts';

export class HealthController {
  public static checkHealth(_req: Request, res: Response): void {
    const health = HealthService.getHealth();
    res.status(200).json({
      success: true,
      message: health.message,
      data: {
        status: 'ok',
        timestamp: health.timestamp || new Date().toISOString(),
      },
    });
  }
}
