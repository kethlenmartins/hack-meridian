import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SendNotificationDto } from '../../application/dto/send-notification.dto';
import { SendNotificationUseCase } from '../../domain/usecases/notification/send-notification.usecase';
import { GetNotificationsUseCase } from '../../domain/usecases/notification/get-notifications.usecase';
import { Notification } from '../../domain/entities/notification.entity';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(ThrottlerGuard)
export class NotificationController {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar notificação por email' })
  @ApiResponse({
    status: 201,
    description: 'Notificação enviada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto): Promise<Notification> {
    return await this.sendNotificationUseCase.execute(sendNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notificações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações retornada com sucesso',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async getNotifications(
    @Query('recipientEmail') recipientEmail?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Notification[]> {
    return await this.getNotificationsUseCase.execute({
      recipientEmail,
      status,
      limit,
      offset,
    });
  }
}
