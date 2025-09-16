import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SendNotificationUseCase } from '../../domain/usecases/notification/send-notification.usecase';
import { GetNotificationsUseCase } from '../../domain/usecases/notification/get-notifications.usecase';
import { SupabaseNotificationRepository } from '../../infrastructure/repositories/supabase-notification.repository';
import { MemoryNotificationRepository } from '../../infrastructure/repositories/memory-notification.repository';
import { EmailModule } from '../../infrastructure/email/email.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Module({
  imports: [EmailModule, DatabaseModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    SendNotificationUseCase,
    GetNotificationsUseCase,
    {
      provide: 'NotificationRepository',
      useClass: MemoryNotificationRepository, // Usando repositório em memória temporariamente
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
