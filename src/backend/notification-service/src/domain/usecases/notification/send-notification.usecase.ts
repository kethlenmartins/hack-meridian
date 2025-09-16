import { Injectable, Inject } from '@nestjs/common';
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
    @Inject('NotificationRepository')
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
        toName: request.recipientEmail.split('@')[0],
        subject: request.subject,
        content: request.content,
        fromName: 'Farm Investment Platform',
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
