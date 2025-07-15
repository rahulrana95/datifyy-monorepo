/**
 * Notification Repository
 * Database operations for notifications
 * 
 * @author Datifyy Engineering Team
 * @since 1.0.0
 */

import { DataSource, Repository } from 'typeorm';
import { DatifyyAdminNotifications } from '../../../../models/entities/DatifyyAdminNotifications';
import { 
  NotificationResponse,
  GetNotificationsRequest,
  UpdateNotificationRequest,
  BaseNotification
} from '../../../../proto-types/admin/notifications';

export class NotificationRepository {
  private repository: Repository<DatifyyAdminNotifications>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(DatifyyAdminNotifications);
  }

  /**
   * Create a new notification
   */
  async create(notification: BaseNotification): Promise<BaseNotification> {
    try {
      const entity = this.repository.create({
        notificationType: notification.channel,
        triggerEvent: notification.triggerEvent,
        recipientAdminId: notification.recipientAdminId,
        recipientChannel: notification.recipientChannel,
        priority: Number(notification.priority),
        title: notification.title,
        message: notification.message,
        status: notification.status,
        createdAt: new Date(notification.createdAt),
        metadata: notification.metadata as any,
      });

      const saved = await this.repository.save(entity);
      return this.mapEntityToResponse(saved);

    } catch (error: any) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  /**
   * Find all notifications with filtering
   */
  async findAll(query: GetNotificationsRequest): Promise<{ data: BaseNotification[]; total: number }> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('notification');

      // Apply filters
      if (query.channels && query.channels.length > 0) {
        queryBuilder.andWhere('notification.notificationType IN (:...channels)', { channels: query.channels });
      }

      if (query.triggerEvents && query.triggerEvents.length > 0) {
        queryBuilder.andWhere('notification.triggerEvent IN (:...triggerEvents)', { triggerEvents: query.triggerEvents });
      }

      if (query.statuses && query.statuses.length > 0) {
        queryBuilder.andWhere('notification.status IN (:...statuses)', { statuses: query.statuses });
      }

      if (query.priorities && query.priorities.length > 0) {
        queryBuilder.andWhere('notification.priority IN (:...priorities)', { priorities: query.priorities });
      }

      if (query.startDate) {
        queryBuilder.andWhere('notification.createdAt >= :startDate', { startDate: new Date(query.startDate) });
      }

      if (query.endDate) {
        queryBuilder.andWhere('notification.createdAt <= :endDate', { endDate: new Date(query.endDate) });
      }

      if (query.recipientAdminId) {
        queryBuilder.andWhere('notification.recipientAdminId = :recipientAdminId', { recipientAdminId: query.recipientAdminId });
      }

      // Apply sorting
      const sortBy = 'createdAt';
      const sortOrder = 'desc';
      queryBuilder.orderBy(`notification.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

      // Apply pagination
      const page = query.pagination?.page || 1;
      const limit = query.pagination?.limit || 20;
      const skip = (page - 1) * limit;

      queryBuilder.skip(skip).take(limit);

      const [entities, total] = await queryBuilder.getManyAndCount();

      return {
        data: entities.map(entity => this.mapEntityToResponse(entity)),
        total
      };

    } catch (error: any) {
      throw new Error(`Failed to find notifications: ${error.message}`);
    }
  }

  /**
   * Find notification by ID
   */
  async findById(id: string): Promise<BaseNotification | null> {
    try {
      const entity = await this.repository.findOne({ where: { id: parseInt(id) } });
      return entity ? this.mapEntityToResponse(entity) : null;

    } catch (error: any) {
      throw new Error(`Failed to find notification by ID: ${error.message}`);
    }
  }

  /**
   * Update notification
   */
  async update(id: string, updates: UpdateNotificationRequest): Promise<BaseNotification | null> {
    try {
      const entity = await this.repository.findOne({ where: { id: parseInt(id) } });
      if (!entity) {
        return null;
      }

      // Apply updates
      if (updates.status) entity.status = updates.status;
      if (updates.failureReason) entity.failureReason = updates.failureReason;
      if (updates.deliveredAt) entity.deliveryConfirmedAt = new Date(updates.deliveredAt);
      if (updates.metadata) entity.metadata = updates.metadata as any;
      if (updates.retryCount !== undefined) entity.retryCount = updates.retryCount;
      
      entity.updatedAt = new Date();

      const saved = await this.repository.save(entity);
      return this.mapEntityToResponse(saved);

    } catch (error: any) {
      throw new Error(`Failed to update notification: ${error.message}`);
    }
  }

  /**
   * Delete notification
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== undefined && result.affected !== null && result.affected > 0;

    } catch (error: any) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Get notification analytics
   */
  async getAnalytics(query: any): Promise<any> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('notification');

      // Apply date filters
      if (query.startDate) {
        queryBuilder.andWhere('notification.createdAt >= :startDate', { startDate: new Date(query.startDate) });
      }

      if (query.endDate) {
        queryBuilder.andWhere('notification.createdAt <= :endDate', { endDate: new Date(query.endDate) });
      }

      // Get total count
      const totalCount = await queryBuilder.getCount();

      // Get success rate
      const successCount = await queryBuilder.andWhere('notification.status = :status', { status: 'delivered' }).getCount();
      const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;

      // Get channel breakdown
      const channelBreakdown = await queryBuilder
        .select('notification.notificationType', 'channel')
        .addSelect('COUNT(*)', 'count')
        .groupBy('notification.notificationType')
        .getRawMany();

      return {
        totalNotifications: totalCount,
        successRate,
        channelBreakdown: channelBreakdown.reduce((acc: any, item: any) => {
          acc[item.channel] = parseInt(item.count);
          return acc;
        }, {}),
        trends: [] // TODO: Implement trends calculation
      };

    } catch (error: any) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  /**
   * Map database entity to response object
   */
  private mapEntityToResponse(entity: DatifyyAdminNotifications): BaseNotification {
    return {
      id: entity.id.toString(),
      triggerEvent: entity.triggerEvent as any,
      channel: entity.notificationType as any,
      priority: entity.priority as any,
      title: entity.title,
      message: entity.message,
      metadata: entity.metadata ? (entity.metadata as any) : {},
      status: entity.status as any,
      recipientAdminId: entity.recipientAdminId || undefined,
      recipientChannel: entity.recipientChannel || undefined,
      createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
      sentAt: entity.sentAt?.toISOString(),
      deliveredAt: entity.deliveryConfirmedAt?.toISOString(),
      failureReason: entity.failureReason || undefined,
      retryCount: entity.retryCount || 0,
      maxRetries: 3
    };
  }
}