export interface HealthStatus {
  success: boolean;
  message: string;
  timestamp?: string;
  version?: string;
  uptimeSeconds?: number;
}

export class HealthService {
  public static getHealth(): HealthStatus {
    const runtimeProcess = (globalThis as { process?: { uptime?: () => number } }).process;
    const uptimeSeconds =
      runtimeProcess && typeof runtimeProcess.uptime === 'function'
        ? Math.floor(runtimeProcess.uptime())
        : 0;

    return {
      success: true,
      message: 'FOCUSFLOW API is running',
      timestamp: new Date().toISOString(),
      version: '0.1.0-alpha',
      uptimeSeconds,
    };
  }
}
