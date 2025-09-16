import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Email do destinatário',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  recipientEmail: string;

  @ApiProperty({
    description: 'Assunto do email',
    example: 'Nova notificação do sistema',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Conteúdo do email',
    example: 'Você recebeu uma nova notificação importante.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Tipo de notificação',
    example: 'email',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;
}
