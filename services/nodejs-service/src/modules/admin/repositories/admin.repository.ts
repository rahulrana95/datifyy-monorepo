import { DataSource, Repository } from 'typeorm';
import { TableInfo, EnumInfo, EmailStatus } from '../types/admin.types';
import { DatifyyEmailLogs } from '../../../models/entities/DatifyyEmailLogs';
import { DatabaseQueryError } from '../errors/admin.errors';
import { Logger } from '../../../infrastructure/logging/Logger';

export interface IAdminRepository {
  getAllTables(): Promise<TableInfo[]>;
  getAllEnums(): Promise<EnumInfo[]>;
  getEnumValues(enumName: string): Promise<string[]>;
  addEnumValue(enumName: string, value: string): Promise<void>;
  getUserEmailStatuses(): Promise<EmailStatus[]>;
}

export class AdminRepository implements IAdminRepository {
  private emailLogsRepo: Repository<DatifyyEmailLogs>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.emailLogsRepo = dataSource.getRepository(DatifyyEmailLogs);
  }

  async getAllTables(): Promise<TableInfo[]> {
    try {
      const result = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);

      return result.map((row: { table_name: string }) => ({
        tableName: row.table_name
      }));
    } catch (error) {
      this.logger.error('Failed to fetch tables', error);
      throw new DatabaseQueryError('Failed to fetch database tables');
    }
  }

  async getAllEnums(): Promise<EnumInfo[]> {
    try {
      const result = await this.dataSource.query(`
        SELECT t.typname AS enum_name, 
               array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
        GROUP BY t.typname
        ORDER BY t.typname;
      `);

      return result.map((row: any) => ({
        enumName: row.enum_name,
        enumValues: row.enum_values // PostgreSQL array_agg returns a proper array
      }));
    } catch (error) {
      this.logger.error('Failed to fetch enums', error);
      throw new DatabaseQueryError('Failed to fetch database enums');
    }
  }

  async getEnumValues(enumName: string): Promise<string[]> {
    try {
      // Validate enum name to prevent SQL injection
      this.validateIdentifier(enumName);

      const result = await this.dataSource.query(
        `SELECT unnest(enum_range(NULL::${enumName})) AS value`
      );

      return result.map((row: { value: string }) => row.value);
    } catch (error) {
      this.logger.error(`Failed to fetch enum values for ${enumName}`, error);
      throw new DatabaseQueryError(`Failed to fetch values for enum: ${enumName}`);
    }
  }

  async addEnumValue(enumName: string, value: string): Promise<void> {
    try {
      // Validate inputs to prevent SQL injection
      this.validateIdentifier(enumName);
      this.validateEnumValue(value);

      await this.dataSource.query(
        `ALTER TYPE ${enumName} ADD VALUE IF NOT EXISTS $1`,
        [value]
      );
    } catch (error) {
      this.logger.error(`Failed to add value to enum ${enumName}`, error);
      throw new DatabaseQueryError(`Failed to add value to enum: ${enumName}`);
    }
  }

  async getUserEmailStatuses(): Promise<EmailStatus[]> {
    try {
      const result = await this.emailLogsRepo
        .createQueryBuilder('log')
        .select(['log.email'])
        .addSelect('jsonb_agg(log ORDER BY log.sentAt DESC) AS logs')
        .groupBy('log.email')
        .getRawMany();

      return result.map((row: any) => ({
        email: row.log_email,
        logs: row.logs
      }));
    } catch (error) {
      this.logger.error('Failed to fetch email statuses', error);
      throw new DatabaseQueryError('Failed to fetch email statuses');
    }
  }

  private validateIdentifier(identifier: string): void {
    // Only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error('Invalid identifier format');
    }
  }

  private validateEnumValue(value: string): void {
    // Basic validation for enum values
    if (!value || value.length > 255) {
      throw new Error('Invalid enum value');
    }
  }
}
