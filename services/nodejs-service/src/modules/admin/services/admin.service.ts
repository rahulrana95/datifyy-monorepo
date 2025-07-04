import { IAdminRepository } from '../repositories/admin.repository';
import { TableInfo, EnumInfo, EnumUpdateRequest, EnumUpdateResult, EmailStatus } from '../types/admin.types';
import { InvalidEnumDataError } from '../errors/admin.errors';
import { Logger } from '../../../infrastructure/logging/Logger';

export interface IAdminService {
  getAllTables(): Promise<TableInfo[]>;
  getAllEnums(): Promise<EnumInfo[]>;
  updateEnums(enums: EnumUpdateRequest[]): Promise<EnumUpdateResult[]>;
  getUserEmailStatuses(): Promise<EmailStatus[]>;
}

export class AdminService implements IAdminService {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly logger: Logger
  ) {}

  async getAllTables(): Promise<TableInfo[]> {
    this.logger.info('Fetching all database tables');
    return this.adminRepository.getAllTables();
  }

  async getAllEnums(): Promise<EnumInfo[]> {
    this.logger.info('Fetching all database enums');
    return this.adminRepository.getAllEnums();
  }

  async updateEnums(enums: EnumUpdateRequest[]): Promise<EnumUpdateResult[]> {
    this.logger.info('Updating enums', { count: enums.length });

    if (!Array.isArray(enums) || enums.length === 0) {
      throw new InvalidEnumDataError('Enums must be a non-empty array');
    }

    const results: EnumUpdateResult[] = [];

    for (const enumUpdate of enums) {
      try {
        const result = await this.updateSingleEnum(enumUpdate);
        results.push(result);
      } catch (error) {
        this.logger.error(`Failed to update enum ${enumUpdate.name}`, error);
        results.push({
          name: enumUpdate.name,
          message: `Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    return results;
  }

  private async updateSingleEnum(enumUpdate: EnumUpdateRequest): Promise<EnumUpdateResult> {
    const { name, values } = enumUpdate;

    // Validate input
    if (!name || !Array.isArray(values) || values.length === 0) {
      throw new InvalidEnumDataError(`Invalid data for enum: ${name}`);
    }

    // Get existing values
    const existingValues = await this.adminRepository.getEnumValues(name);
    
    // Find new values to add
    const valuesToAdd = values.filter(val => !existingValues.includes(val));

    if (valuesToAdd.length === 0) {
      return {
        name,
        message: 'No new values to add',
        updatedValues: existingValues
      };
    }

    // Add new values
    for (const value of valuesToAdd) {
      await this.adminRepository.addEnumValue(name, value);
    }

    // Get updated values
    const updatedValues = await this.adminRepository.getEnumValues(name);

    return {
      name,
      message: `Added ${valuesToAdd.length} new values`,
      updatedValues
    };
  }

  async getUserEmailStatuses(): Promise<EmailStatus[]> {
    this.logger.info('Fetching user email statuses');
    return this.adminRepository.getUserEmailStatuses();
  }
}
