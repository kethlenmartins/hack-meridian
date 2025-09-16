import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { EmailModule } from '../../infrastructure/email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
