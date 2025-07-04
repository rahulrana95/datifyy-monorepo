import { DataSource } from 'typeorm';
import { Config } from '../config/Config';
import { Logger } from '../logging/Logger';

export class DatabaseConnection {
  private dataSource: DataSource | null = null;
  
  constructor(
    private readonly config: Config,
    private readonly logger: Logger
  ) {}

  async connect(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    try {
      const dbConfig = this.config.get('database');
      
      this.dataSource = new DataSource({
        ...dbConfig,
        entities: [__dirname + '/../../models/entities/*.{ts,js}'],
        migrations: [__dirname + '/../../migrations/*.{ts,js}'],
      });

      await this.dataSource.initialize();
      this.logger.info('Database connection established');
      
      return this.dataSource;
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
      this.logger.info('Database connection closed');
    }
  }

  getDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database connection not initialized');
    }
    return this.dataSource;
  }
}