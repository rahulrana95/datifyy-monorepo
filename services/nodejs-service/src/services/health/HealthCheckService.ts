import { DatabaseConnection } from '../../infrastructure/database/DatabaseConnection';
import { Logger } from '../../infrastructure/logging/Logger';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: Date;
  checks: {
    database: boolean;
    memory: boolean;
  };
}

export class HealthCheckService {
  constructor(
    private readonly databaseConnection: DatabaseConnection,
    private readonly logger: Logger
  ) {}

  async getHealth(): Promise<HealthStatus> {
    const checks = {
      database: await this.checkDatabase(),
      memory: this.checkMemory(),
    };

    return {
      status: Object.values(checks).every(check => check) ? 'healthy' : 'unhealthy',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date(),
      checks,
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const dataSource = this.databaseConnection.getDataSource();
      await dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  private checkMemory(): boolean {
    const used = process.memoryUsage();
    const limit = 1024 * 1024 * 1024; // 1GB
    return used.heapUsed < limit;
  }
}
