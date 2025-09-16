import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as emailjs from '@emailjs/nodejs';

export interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  content: string;
  fromName?: string;
  templateData?: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly emailJsPublicKey: string | undefined;
  private readonly emailJsPrivateKey: string | undefined;
  private readonly emailJsServiceId: string | undefined;
  private readonly emailJsTemplateId: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.emailJsPublicKey = this.configService.get<string>('EMAILJS_PUBLIC_KEY');
    this.emailJsPrivateKey = this.configService.get<string>('EMAILJS_PRIVATE_KEY');
    this.emailJsServiceId = this.configService.get<string>('EMAILJS_SERVICE_ID');
    this.emailJsTemplateId = this.configService.get<string>('EMAILJS_TEMPLATE_ID');
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      const fromName = emailData.fromName || 'Farm Investment Platform';
      const toName = emailData.toName || emailData.to.split('@')[0];

      if (!this.emailJsPublicKey || !this.emailJsServiceId || !this.emailJsTemplateId) {
        this.logger.error('EmailJS configuration missing. Ensure EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID are set.');
        throw new Error('EmailJS configuration missing');
      }

      const templateParams = {
        to_email: emailData.to,
        to_name: toName,
        from_name: fromName,
        subject: emailData.subject,
        message: emailData.content,
        ...(emailData.templateData || {}),
      } as Record<string, any>;

      const response = await emailjs.send(
        this.emailJsServiceId,
        this.emailJsTemplateId,
        templateParams,
        {
          publicKey: this.emailJsPublicKey,
          privateKey: this.emailJsPrivateKey,
        },
      );

      this.logger.log(`EmailJS: Email enviado para ${emailData.to}. Status: ${response.status}`);
    } catch (error) {
      const safeError = typeof error === 'object' ? JSON.stringify(error) : String(error);
      // Tente extrair campos comuns
      const message = (error as any)?.message || (error as any)?.text || safeError;
      const status = (error as any)?.status;
      this.logger.error(`Failed to send email to ${emailData.to}: ${message}${status ? ` (status ${status})` : ''}`);
      throw error;
    }
  }

  async sendBulkEmails(emails: EmailData[]): Promise<void> {
    const promises = emails.map(email => this.sendEmail(email));
    await Promise.all(promises);
  }

  async verifyConnection(): Promise<boolean> {
    // Com EmailJS não há conexão persistente; validamos presença de variáveis
    const hasConfig = Boolean(this.emailJsPublicKey && this.emailJsServiceId && this.emailJsTemplateId);
    if (!hasConfig) {
      this.logger.warn('EmailJS not fully configured. Missing one or more variables.');
    }
    return hasConfig;
  }
}
