import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  sendNotification(fcmToken: string, title: string, body: string) {
    this.client.emit('notification_send', { fcmToken, title, body });
  }

  broadcastNotification(fcmTokens: string[], title: string, body: string) {
    this.client.emit('notification_broadcast', { fcmTokens, title, body });
  }
}
