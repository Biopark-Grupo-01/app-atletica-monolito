import { Inject, Injectable, Logger } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { FirebaseMessagingService } from '../../infrastructure/firebase/firebase-messaging.service';
import {
  SendNotificationDto,
  BroadcastNotificationDto,
} from '../dtos/notification.dto';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
    private readonly firebaseMessagingService: FirebaseMessagingService,
  ) {}

  async send(dto: SendNotificationDto): Promise<Notification> {
    this.logger.log(
      `Sending notification titled "${dto.title}" to token ${dto.fcmToken.substring(
        0,
        10,
      )}...`,
    );

    const notification = new Notification();
    notification.title = dto.title;
    notification.body = dto.body;
    notification.fcmToken = dto.fcmToken;

    await this.firebaseMessagingService.sendNotification(
      notification.fcmToken,
      notification.title,
      notification.body,
    );

    await this.notificationRepository.save(notification);
    this.logger.log(
      `Notification sent and saved for token ${dto.fcmToken.substring(0, 10)}...`,
    );
    return notification;
  }

  async sendBroadcast(dto: BroadcastNotificationDto): Promise<void> {
    this.logger.log(
      `Starting broadcast of "${dto.title}" to ${dto.fcmTokens.length} tokens.`,
    );

    const notificationPayload = {
      title: dto.title,
      body: dto.body,
    };

    // Persist a single record for the broadcast action for auditing
    const broadcastRecord = new Notification();
    broadcastRecord.title = `BROADCAST: ${dto.title}`;
    broadcastRecord.body = dto.body;
    broadcastRecord.fcmToken = `Broadcast to ${dto.fcmTokens.length} users.`;
    await this.notificationRepository.save(broadcastRecord);

    // Use Promise.allSettled to send all notifications and not fail if one token is invalid.
    const results = await Promise.allSettled(
      dto.fcmTokens.map((token) =>
        this.firebaseMessagingService.sendNotification(
          token,
          notificationPayload.title,
          notificationPayload.body,
        ),
      ),
    );

    const successfulSends = results.filter(
      (r) => r.status === 'fulfilled',
    ).length;
    const failedSends = results.length - successfulSends;

    this.logger.log(
      `Broadcast finished. Successful sends: ${successfulSends}, Failed sends: ${failedSends}`,
    );

    if (failedSends > 0) {
      this.logger.warn(
        'Some notifications failed to send. Check Firebase logs for details on invalid tokens.',
      );
    }
  }
}
