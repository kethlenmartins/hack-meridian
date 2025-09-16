import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

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
  private transporter: nodemailer.Transporter;
  private readonly emailProvider: string;

  constructor(private readonly configService: ConfigService) {
    this.emailProvider = this.configService.get<string>('EMAIL_PROVIDER') || 'ethereal';
    this.setupTransporter();
  }

  private setupTransporter() {
    const provider = this.emailProvider.toLowerCase();

    switch (provider) {
      case 'sendgrid':
        this.setupSendGrid();
        break;
      case 'gmail':
        this.setupGmail();
        break;
      case 'ethereal':
      default:
        this.setupEthereal();
        break;
    }
  }

  private setupSendGrid() {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      this.logger.warn('SendGrid API key not configured. Falling back to Ethereal.');
      this.setupEthereal();
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: apiKey,
      },
    });
  }

  private setupGmail() {
    const user = this.configService.get<string>('GMAIL_USER');
    const pass = this.configService.get<string>('GMAIL_APP_PASSWORD');
    
    if (!user || !pass) {
      this.logger.warn('Gmail credentials not configured. Falling back to Ethereal.');
      this.setupEthereal();
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  private setupEthereal() {
    // Modo de desenvolvimento - simula envio sem SMTP real
    this.transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
    this.logger.log('Using Development Mode - emails will be logged, not sent');
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      const fromName = emailData.fromName || 'Farm Investment Platform';
      const toName = emailData.toName || emailData.to.split('@')[0];

      // Template HTML baseado no seu template do EmailJS
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${emailData.subject}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                    background-color: #f5f5f5;
                }
                .email-container {
                    background-color: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header { 
                    background-color: #2c5530; 
                    color: white; 
                    padding: 20px; 
                    text-align: center; 
                    border-radius: 8px 8px 0 0; 
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .content { 
                    background-color: #f9f9f9; 
                    padding: 30px; 
                    border-radius: 0 0 8px 8px; 
                }
                .content h2 {
                    color: #2c5530;
                    margin-top: 0;
                }
                .footer { 
                    margin-top: 20px; 
                    padding-top: 20px; 
                    border-top: 1px solid #ddd; 
                    font-size: 12px; 
                    color: #666; 
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>🌱 Farm Investment Platform</h1>
                </div>
                <div class="content">
                    <h2>Olá ${toName}!</h2>
                    <p>${emailData.content.replace(/\n/g, '<br>')}</p>
                    <p><em>Esta é uma notificação automática do sistema Farm Investment Platform.</em></p>
                    <div class="footer">
                        <p>Atenciosamente,<br><strong>${fromName}</strong><br>Farm Investment Platform</p>
                        <p><small>Este é um email automático, por favor não responda.</small></p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"${fromName}" <noreply@farminvestment.com>`,
        to: emailData.to,
        subject: emailData.subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (this.emailProvider === 'ethereal') {
        // Modo de desenvolvimento - loga o email
        this.logger.log(`📧 EMAIL SIMULADO (Development Mode):`);
        this.logger.log(`   To: ${emailData.to}`);
        this.logger.log(`   Subject: ${emailData.subject}`);
        this.logger.log(`   Content: ${emailData.content}`);
        this.logger.log(`   HTML Preview: ${htmlContent.substring(0, 200)}...`);
      } else {
        this.logger.log(`Email sent successfully to ${emailData.to}. Message ID: ${info.messageId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailData.to}:`, error);
      throw error;
    }
  }

  async sendBulkEmails(emails: EmailData[]): Promise<void> {
    const promises = emails.map(email => this.sendEmail(email));
    await Promise.all(promises);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log(`${this.emailProvider.toUpperCase()} SMTP connection verified successfully`);
      return true;
    } catch (error) {
      this.logger.error(`${this.emailProvider.toUpperCase()} SMTP connection verification failed:`, error);
      return false;
    }
  }
}
