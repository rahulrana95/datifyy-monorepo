import { AdminService } from '../services/admin.service';
import { IAdminRepository } from '../repositories/admin.repository';
import { Logger } from '../../../infrastructure/logging/Logger';
import { InvalidEnumDataError } from '../errors/admin.errors';

describe('AdminService', () => {
  let adminService: AdminService;
  let mockRepository: jest.Mocked<IAdminRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockRepository = {
      getAllTables: jest.fn(),
      getAllEnums: jest.fn(),
      getEnumValues: jest.fn(),
      addEnumValue: jest.fn(),
      getUserEmailStatuses: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any;

    adminService = new AdminService(mockRepository, mockLogger);
  });

  describe('getAllTables', () => {
    it('should return all tables from repository', async () => {
      const mockTables = [
        { tableName: 'users' },
        { tableName: 'events' }
      ];
      mockRepository.getAllTables.mockResolvedValue(mockTables);

      const result = await adminService.getAllTables();

      expect(result).toEqual(mockTables);
      expect(mockLogger.info).toHaveBeenCalledWith('Fetching all database tables');
    });
  });

  describe('updateEnums', () => {
    it('should throw error for empty array', async () => {
      await expect(adminService.updateEnums([])).rejects.toThrow(InvalidEnumDataError);
    });

    it('should update enums successfully', async () => {
      const enumRequest = [{
        name: 'user_status',
        values: ['active', 'inactive', 'suspended']
      }];

      mockRepository.getEnumValues
        .mockResolvedValueOnce(['active', 'inactive'])
        .mockResolvedValueOnce(['active', 'inactive', 'suspended']);

      const result = await adminService.updateEnums(enumRequest);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'user_status',
        message: 'Added 1 new values',
        updatedValues: ['active', 'inactive', 'suspended']
      });
      expect(mockRepository.addEnumValue).toHaveBeenCalledWith('user_status', 'suspended');
    });

    it('should handle enum with no new values', async () => {
      const enumRequest = [{
        name: 'user_status',
        values: ['active']
      }];

      mockRepository.getEnumValues.mockResolvedValue(['active', 'inactive']);

      const result = await adminService.updateEnums(enumRequest);

      expect(result[0].message).toBe('No new values to add');
      expect(mockRepository.addEnumValue).not.toHaveBeenCalled();
    });
  });
});
