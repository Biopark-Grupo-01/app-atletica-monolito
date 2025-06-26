import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseMessagingService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    this.messaging = admin.messaging();
  }

  async sendNotification(
    fcmToken: string,
    title: string,
    body: string,
  ): Promise<string> {
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      token: fcmToken,
    };

    return this.messaging.send(message);
  }
}
