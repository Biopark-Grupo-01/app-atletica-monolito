import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

// Payload for sending a notification to a single user
export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}

// Payload for broadcasting a notification to multiple users
export class BroadcastNotificationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  fcmTokens: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
