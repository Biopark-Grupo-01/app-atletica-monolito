import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import firebaseServiceAccount from '../../firebase-service-account.json';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  private readonly defaultApp: firebase.app.App;
  private readonly logger = new Logger(FirebaseStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    if (!firebase.apps.length) {
      try {
        this.defaultApp = firebase.initializeApp({
          credential: firebase.credential.cert(
            firebaseServiceAccount as ServiceAccount,
          ),
        });
        this.logger.log('Firebase Admin SDK initialized successfully.');
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error
            ? e.message
            : 'Unknown error during Firebase initialization.';
        this.logger.error(
          `Failed to initialize Firebase Admin SDK: ${errorMessage}`,
          e instanceof Error ? e.stack : undefined,
        );
        throw new Error(`Firebase initialization failed: ${errorMessage}`);
      }
    } else {
      this.defaultApp = firebase.app();
      this.logger.log('Using existing Firebase Admin SDK app instance.');
    }
  }

  async validate(token: string): Promise<firebase.auth.DecodedIdToken> {
    try {
      const firebaseUser = await this.defaultApp
        .auth()
        .verifyIdToken(token, true);
      if (!firebaseUser) {
        this.logger.warn(
          `Token validation failed: User not found for token (prefix): ${token.substring(
            0,
            20,
          )}...`,
        );
        throw new UnauthorizedException(
          'User not found based on Firebase token.',
        );
      }
      return firebaseUser;
    } catch (error: unknown) {
      let detailedMessage = 'Error validating Firebase token.';
      let errorCode = 'UNKNOWN_ERROR'; // Default error code

      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: string }).message === 'string'
      ) {
        detailedMessage = (error as { message: string }).message;
        if (
          'code' in error &&
          typeof (error as { code: string }).code === 'string'
        ) {
          errorCode = (error as { code: string }).code;
        }
      } else if (error instanceof Error) {
        detailedMessage = error.message;
      } else if (typeof error === 'string') {
        detailedMessage = error;
      }

      this.logger.error(
        `Firebase token validation failed. Code: ${errorCode}, Message: "${detailedMessage}". Token prefix: ${token.substring(
          0,
          20,
        )}...`,
        error instanceof Error ? error.stack : 'No stack trace available.',
      );
      throw new UnauthorizedException(
        `Firebase token validation failed: ${detailedMessage} (Code: ${errorCode})`,
      );
    }
  }
}
