import { Notification } from '../entities/notification.entity';

export interface NotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByRecipientEmail(email: string): Promise<Notification[]>;
  findByStatus(status: string): Promise<Notification[]>;
  update(notification: Notification): Promise<Notification>;
  delete(id: string): Promise<void>;
}
