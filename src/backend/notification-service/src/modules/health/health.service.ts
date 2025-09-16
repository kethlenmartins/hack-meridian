import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { EmailService } from '../../infrastructure/email/email.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  async check() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        email: 'unknown',
      },
    };

    try {
      // Verifica conexão com o banco de dados
      const dbStatus = await this.databaseService.testConnection();
      checks.services.database = dbStatus ? 'ok' : 'error';

      // Verifica conexão com o serviço de email
      const emailStatus = await this.emailService.verifyConnection();
      checks.services.email = emailStatus ? 'ok' : 'error';

      // Se algum serviço estiver com erro, marca o status geral como error
      if (checks.services.database === 'error' || checks.services.email === 'error') {
        checks.status = 'error';
      }

      this.logger.log('Health check completed', checks);
      return checks;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      checks.status = 'error';
      checks.services.database = 'error';
      checks.services.email = 'error';
      return checks;
    }
  }
}
