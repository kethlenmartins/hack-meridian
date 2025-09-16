import { Injectable, Inject } from '@nestjs/common';
import { Notification } from '../../entities/notification.entity';
import { NotificationRepository } from '../../repositories/notification.repository';

export interface GetNotificationsRequest {
  recipientEmail?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(request: GetNotificationsRequest): Promise<Notification[]> {
    if (request.recipientEmail) {
      return await this.notificationRepository.findByRecipientEmail(
        request.recipientEmail,
      );
    }

    if (request.status) {
      return await this.notificationRepository.findByStatus(request.status);
    }

    // Se não especificar filtros, retorna todas (implementação básica)
    return await this.notificationRepository.findByRecipientEmail('');
  }
}
