import { Request, Response, NextFunction } from 'express';
import { IAdminService } from '../services/admin.service';
import { EnumUpdateRequest } from '../types/admin.types';

export class AdminController {
  constructor(private readonly adminService: IAdminService) {}

  async getAllTables(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tables = await this.adminService.getAllTables();
      
      res.status(200).json({
        success: true,
        data: {
          tables,
          count: tables.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEnums(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const enums = await this.adminService.getAllEnums();
      
      res.status(200).json({
        success: true,
        data: {
          enums,
          count: enums.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEnums(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { enums } = req.body as { enums: EnumUpdateRequest[] };
      
      const results = await this.adminService.updateEnums(enums);
      
      const hasErrors = results.some(result => result.message?.includes('Failed'));
      
      res.status(hasErrors ? 207 : 200).json({
        success: !hasErrors,
        message: hasErrors ? 'Some enums failed to update' : 'All enums updated successfully',
        data: {
          results,
          summary: {
            total: results.length,
            succeeded: results.filter(r => !r.message?.includes('Failed')).length,
            failed: results.filter(r => r.message?.includes('Failed')).length
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserEmailStatuses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const emailStatuses = await this.adminService.getUserEmailStatuses();
      
      res.status(200).json({
        success: true,
        data: {
          emailStatuses,
          count: emailStatuses.length
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
