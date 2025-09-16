import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { NotificationRepository } from '../../repositories/notification.repository';
import { EmailService } from '../../../infrastructure/email/email.service';

export interface SendNotificationRequest {
  recipientEmail: string;
  subject: string;
  content: string;
  type?: NotificationType;
}

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(request: SendNotificationRequest): Promise<Notification> {
    const notification = Notification.create(
      request.recipientEmail,
      request.subject,
      request.content,
      request.type || NotificationType.EMAIL,
    );

    // Salva a notificação no banco
    const savedNotification = await this.notificationRepository.save(notification);

    try {
      // Envia o email
      await this.emailService.sendEmail({
        to: request.recipientEmail,
        subject: request.subject,
        content: request.content,
      });

      // Marca como enviada
      const sentNotification = savedNotification.markAsSent();
      return await this.notificationRepository.update(sentNotification);
    } catch (error) {
      // Marca como falhada
      const failedNotification = savedNotification.markAsFailed(
        error instanceof Error ? error.message : 'Unknown error',
      );
      return await this.notificationRepository.update(failedNotification);
    }
  }
}
