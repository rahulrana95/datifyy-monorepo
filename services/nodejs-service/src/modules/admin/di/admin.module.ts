import { Container } from '../../../infrastructure/di/Container';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { AdminRepository } from '../repositories/admin.repository';
import { DataSource } from 'typeorm';
import { Logger } from '../../../infrastructure/logging/Logger';

export function registerAdminModule(container: Container): void {
  // Register repository
  container.register('AdminRepository', async () => {
    const dataSource = await container.resolve<DataSource>('DataSource');
    const logger = await container.resolve<Logger>('Logger');
    return new AdminRepository(dataSource, logger);
  });

  // Register service
  container.register('AdminService', async () => {
    const repository = await container.resolve<AdminRepository>('AdminRepository');
    const logger = await container.resolve<Logger>('Logger');
    return new AdminService(repository, logger);
  });

  // Register controller
  container.register('AdminController', async () => {
    const service = await container.resolve<AdminService>('AdminService');
    return new AdminController(service);
  });
}
