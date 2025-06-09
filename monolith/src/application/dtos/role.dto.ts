import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'Admin' })
  name: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Administrator role with full access',
  })
  description?: string;
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'Role name', example: 'Super Admin' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Super administrator with extended privileges',
  })
  description?: string;
}

export class RoleResponseDto {
  @ApiProperty({
    description: 'Unique ID of the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Role name', example: 'Admin' })
  name: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Administrator role with full access',
  })
  description?: string | null;

  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;

  @ApiProperty({ description: 'Date of last update' })
  updatedAt: Date;
}
