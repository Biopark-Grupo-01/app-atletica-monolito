import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../../domain/entities/event.entity';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';

export class CreateEventDto {
  @ApiProperty({ description: 'Event title', example: 'Annual Athletic Party' })
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Join us for our annual celebration',
  })
  description: string;

  @ApiProperty({
    description: 'Event date and time',
    example: '2025-06-15T19:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Event location',
    example: 'University Sports Complex',
  })
  location: string;

  @ApiProperty({ description: 'Event price', example: 25.0 })
  price: number;

  @ApiProperty({
    description: 'Event type',
    enum: EventType,
    example: EventType.PARTY,
    default: EventType.OTHER,
  })
  type: EventType;
}

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Event title',
    example: 'Annual Athletic Party 2025',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Join us for our annual celebration with special guests',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Event date and time',
    example: '2025-06-16T20:00:00Z',
  })
  date?: Date;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'University Main Auditorium',
  })
  location?: string;

  @ApiPropertyOptional({ description: 'Event price', example: 30.0 })
  price?: number;

  @ApiPropertyOptional({
    description: 'Event type',
    enum: EventType,
    example: EventType.PARTY,
  })
  type?: EventType;
}

export class EventResponseDto {
  @ApiProperty({
    description: 'Event unique ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Event title', example: 'Annual Athletic Party' })
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Join us for our annual celebration',
  })
  description: string;

  @ApiProperty({
    description: 'Event date and time',
    example: '2025-06-15T19:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Event location',
    example: 'University Sports Complex',
  })
  location: string;

  @ApiProperty({ description: 'Event price', example: 25.0 })
  price: number;

  @ApiProperty({
    description: 'Event type',
    enum: EventType,
    example: EventType.PARTY,
  })
  type: EventType;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-05-22T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-05-22T10:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'HATEOAS links related to the event',
    type: () => [HateoasLinkDto], // Adjusted for Swagger, actual type is HateoasLinkDto[]
  })
  _links?: HateoasLinkDto[]; // Corrected import name
}
