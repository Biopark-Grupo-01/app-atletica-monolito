import { Injectable, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateUserDto } from '../dtos/user.dto';

@Injectable()
export class AuthService {
  async createFirebaseUser(createUserDto: CreateUserDto): Promise<string> {
    const { email, password, name } = createUserDto;

    if (!password) {
      throw new BadRequestException('Password is required for signup.');
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });
      return userRecord.uid;
    } catch (error) {
      // Log the full error for debugging
      console.error('Firebase user creation failed:', error);
      // Return a user-friendly message
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }
}
