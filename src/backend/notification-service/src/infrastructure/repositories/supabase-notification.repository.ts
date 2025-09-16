import { Injectable, Logger } from '@nestjs/common';
import { Notification, NotificationStatus, NotificationType } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SupabaseNotificationRepository implements NotificationRepository {
  private readonly logger = new Logger(SupabaseNotificationRepository.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async save(notification: Notification): Promise<Notification> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('notifications')
        .insert({
          id: notification.id,
          recipient_email: notification.recipientEmail,
          subject: notification.subject,
          content: notification.content,
          type: notification.type,
          status: notification.status,
          created_at: notification.createdAt.toISOString(),
          sent_at: notification.sentAt?.toISOString(),
          error_message: notification.errorMessage,
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Error saving notification:', error);
        throw new Error(`Failed to save notification: ${error.message}`);
      }

      return this.mapToEntity(data);
    } catch (error) {
      this.logger.error('Error saving notification:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Notification | null> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        this.logger.error('Error finding notification by id:', error);
        throw new Error(`Failed to find notification: ${error.message}`);
      }

      return this.mapToEntity(data);
    } catch (error) {
      this.logger.error('Error finding notification by id:', error);
      throw error;
    }
  }

  async findByRecipientEmail(email: string): Promise<Notification[]> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('notifications')
        .select('*')
        .eq('recipient_email', email)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error finding notifications by email:', error);
        throw new Error(`Failed to find notifications: ${error.message}`);
      }

      return data.map(item => this.mapToEntity(item));
    } catch (error) {
      this.logger.error('Error finding notifications by email:', error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<Notification[]> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('notifications')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error finding notifications by status:', error);
        throw new Error(`Failed to find notifications: ${error.message}`);
      }

      return data.map(item => this.mapToEntity(item));
    } catch (error) {
      this.logger.error('Error finding notifications by status:', error);
      throw error;
    }
  }

  async update(notification: Notification): Promise<Notification> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('notifications')
        .update({
          recipient_email: notification.recipientEmail,
          subject: notification.subject,
          content: notification.content,
          type: notification.type,
          status: notification.status,
          created_at: notification.createdAt.toISOString(),
          sent_at: notification.sentAt?.toISOString(),
          error_message: notification.errorMessage,
        })
        .eq('id', notification.id)
        .select()
        .single();

      if (error) {
        this.logger.error('Error updating notification:', error);
        throw new Error(`Failed to update notification: ${error.message}`);
      }

      return this.mapToEntity(data);
    } catch (error) {
      this.logger.error('Error updating notification:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.databaseService
        .getClient()
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error('Error deleting notification:', error);
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    } catch (error) {
      this.logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  private mapToEntity(data: any): Notification {
    return new Notification(
      data.id,
      data.recipient_email,
      data.subject,
      data.content,
      data.type as NotificationType,
      data.status as NotificationStatus,
      new Date(data.created_at),
      data.sent_at ? new Date(data.sent_at) : undefined,
      data.error_message,
    );
  }
}
