import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class MemoryNotificationRepository implements NotificationRepository {
  private readonly logger = new Logger(MemoryNotificationRepository.name);
  private notifications: Map<string, Notification> = new Map();

  async save(notification: Notification): Promise<Notification> {
    try {
      this.notifications.set(notification.id, notification);
      this.logger.log(`Notification saved in memory: ${notification.id}`);
      return notification;
    } catch (error) {
      this.logger.error('Error saving notification in memory:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Notification | null> {
    try {
      const notification = this.notifications.get(id);
      return notification || null;
    } catch (error) {
      this.logger.error('Error finding notification by id in memory:', error);
      throw error;
    }
  }

  async findByRecipientEmail(email: string): Promise<Notification[]> {
    try {
      const notifications = Array.from(this.notifications.values())
        .filter(notification => notification.recipientEmail === email)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return notifications;
    } catch (error) {
      this.logger.error('Error finding notifications by email in memory:', error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<Notification[]> {
    try {
      const notifications = Array.from(this.notifications.values())
        .filter(notification => notification.status === status)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return notifications;
    } catch (error) {
      this.logger.error('Error finding notifications by status in memory:', error);
      throw error;
    }
  }

  async update(notification: Notification): Promise<Notification> {
    try {
      this.notifications.set(notification.id, notification);
      this.logger.log(`Notification updated in memory: ${notification.id}`);
      return notification;
    } catch (error) {
      this.logger.error('Error updating notification in memory:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.notifications.delete(id);
      this.logger.log(`Notification deleted from memory: ${id}`);
    } catch (error) {
      this.logger.error('Error deleting notification from memory:', error);
      throw error;
    }
  }
}
