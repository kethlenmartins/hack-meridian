import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { SendNotificationUseCase } from '../../domain/usecases/notification/send-notification.usecase';
import { GetNotificationsUseCase } from '../../domain/usecases/notification/get-notifications.usecase';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
  ) {}

  async sendNotification(data: {
    recipientEmail: string;
    subject: string;
    content: string;
  }): Promise<Notification> {
    this.logger.log(`Sending notification to ${data.recipientEmail}`);
    return await this.sendNotificationUseCase.execute(data);
  }

  async getNotifications(filters: {
    recipientEmail?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Notification[]> {
    this.logger.log(`Getting notifications with filters: ${JSON.stringify(filters)}`);
    return await this.getNotificationsUseCase.execute(filters);
  }
}
