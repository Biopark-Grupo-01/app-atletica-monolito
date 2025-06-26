import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../../application/services/notification.service';
import {
  BroadcastNotificationDto,
  SendNotificationDto,
} from '../../application/dtos/notification.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('notification_send')
  async handleSendNotification(@Payload() data: SendNotificationDto) {
    await this.notificationService.send(data);
  }

  @EventPattern('notification_broadcast')
  async handleBroadcastNotification(@Payload() data: BroadcastNotificationDto) {
    await this.notificationService.sendBroadcast(data);
  }
}
