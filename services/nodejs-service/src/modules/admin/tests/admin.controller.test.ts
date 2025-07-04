import { Request, Response, NextFunction } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { IAdminService } from '../services/admin.service';

describe('AdminController', () => {
  let adminController: AdminController;
  let mockService: jest.Mocked<IAdminService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockService = {
      getAllTables: jest.fn(),
      getAllEnums: jest.fn(),
      updateEnums: jest.fn(),
      getUserEmailStatuses: jest.fn(),
    };

    adminController = new AdminController(mockService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('getAllTables', () => {
    it('should return tables with success response', async () => {
      const mockTables = [{ tableName: 'users' }];
      mockService.getAllTables.mockResolvedValue(mockTables);

      await adminController.getAllTables(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          tables: mockTables,
          count: 1
        }
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      mockService.getAllTables.mockRejectedValue(error);

      await adminController.getAllTables(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});