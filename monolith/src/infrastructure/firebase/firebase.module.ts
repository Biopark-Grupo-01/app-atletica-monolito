import { Module, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Module({})
export class FirebaseModule implements OnModuleInit {
  private readonly logger = new Logger(FirebaseModule.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    if (admin.apps.length === 0) {
      this.logger.log('Initializing Firebase Admin SDK...');
      const serviceAccountKey = this.configService.get<string>(
        'FIREBASE_SERVICE_ACCOUNT_KEY',
      );

      if (!serviceAccountKey) {
        this.logger.error(
          'FIREBASE_SERVICE_ACCOUNT_KEY environment variable not found.',
        );
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT_KEY environment variable not found.',
        );
      }

      try {
        const serviceAccount = JSON.parse(serviceAccountKey) as ServiceAccount;
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.logger.log('Firebase Admin SDK initialized successfully.');
      } catch (error) {
        this.logger.error(
          'Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY.',
          error,
        );
        throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY.');
      }
    }
  }
}
