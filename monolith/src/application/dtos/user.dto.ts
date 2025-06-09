import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleResponseDto } from './role.dto';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiPropertyOptional({ description: 'User CPF', example: '123.456.789-00' })
  cpf?: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'strongPassword123',
  })
  password?: string;

  @ApiPropertyOptional({ description: 'User phone', example: '+5511999999999' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL of profile picture',
    example: 'http://example.com/profile.jpg',
  })
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Google ID for social login',
    example: 'google12345',
  })
  googleId?: string;

  @ApiPropertyOptional({
    description: 'FCM token for push notifications',
    example: 'fcmToken12345',
  })
  fcmToken?: string;

  @ApiPropertyOptional({
    description: "ID of the user's role",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  roleId?: string;

  @ApiPropertyOptional({
    description: 'Plan start date',
    example: '2025-01-01T00:00:00Z',
  })
  planStartDate?: Date;

  @ApiPropertyOptional({
    description: 'Plan end date',
    example: '2026-01-01T00:00:00Z',
  })
  planEndDate?: Date;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User name', example: 'Jane Doe' })
  name?: string;

  @ApiPropertyOptional({ description: 'User CPF', example: '000.111.222-33' })
  cpf?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'jane.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'evenStrongerPassword456',
  })
  password?: string;

  @ApiPropertyOptional({ description: 'User phone', example: '+5511888888888' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL of profile picture',
    example: 'http://example.com/new_profile.jpg',
  })
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Google ID for social login',
    example: 'google67890',
  })
  googleId?: string;

  @ApiPropertyOptional({
    description: 'FCM token for push notifications',
    example: 'fcmToken67890',
  })
  fcmToken?: string;

  @ApiPropertyOptional({
    description: "ID of the user's role",
    example: '456e7890-e12b-34d5-a678-789012345678',
  })
  roleId?: string;

  @ApiPropertyOptional({
    description: 'Plan start date',
    example: '2025-02-01T00:00:00Z',
  })
  planStartDate?: Date;

  @ApiPropertyOptional({
    description: 'Plan end date',
    example: '2026-02-01T00:00:00Z',
  })
  planEndDate?: Date;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique ID of the user',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiPropertyOptional({ description: 'User CPF', example: '123.456.789-00' })
  cpf?: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'User phone', example: '+5511999999999' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL of profile picture',
    example: 'http://example.com/profile.jpg',
  })
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Google ID for social login',
    example: 'google12345',
  })
  googleId?: string;

  @ApiPropertyOptional({ description: 'FCM token for push notifications' })
  fcmToken?: string;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  role?: RoleResponseDto;

  @ApiPropertyOptional({
    description: 'Plan start date',
    example: '2025-01-01T00:00:00Z',
  })
  planStartDate?: Date;

  @ApiPropertyOptional({
    description: 'Plan end date',
    example: '2026-01-01T00:00:00Z',
  })
  planEndDate?: Date;

  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;

  @ApiProperty({ description: 'Date of last update' })
  updatedAt: Date;
}
