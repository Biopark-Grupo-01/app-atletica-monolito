import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HateoasLinkDto } from 'src/interfaces/http/hateoas-link.dto';

export class CreateNewsDto {
  @ApiProperty({
    description: 'News title',
    example: 'Championship Results Announced',
  })
  title: string;

  @ApiProperty({
    description: 'News description',
    example: 'Our team secured first place at the national championship!',
  })
  description: string;

  @ApiProperty({
    description: 'Publication date',
    example: '2025-06-15T10:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'News author',
    example: 'João Silva',
  })
  author: string;

  @ApiPropertyOptional({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl?: string;
}

export class UpdateNewsDto {
  @ApiPropertyOptional({
    description: 'News title',
    example: 'Updated: Championship Results',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'News description',
    example: 'An update on our championship performance.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Publication date',
    example: '2025-06-16T12:00:00Z',
  })
  date?: Date;

  @ApiPropertyOptional({
    description: 'News author',
    example: 'Updated Author',
  })
  author?: string;

  @ApiPropertyOptional({
    description: 'Image URL',
    example: 'https://example.com/updated_image.jpg',
  })
  imageUrl?: string;
}

export class NewsResponseDto {
  @ApiProperty({
    description: 'News unique ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'News title',
    example: 'Championship Results Announced',
  })
  title: string;

  @ApiProperty({
    description: 'News description',
    example: 'Our team secured first place at the national championship!',
  })
  description: string;

  @ApiProperty({
    description: 'Publication date',
    example: '2025-06-15T10:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'News author',
    example: 'João Silva',
  })
  author: string;

  @ApiPropertyOptional({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-05-22T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-05-22T12:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'HATEOAS links related to the news',
    type: () => [HateoasLinkDto],
  })
  _links?: HateoasLinkDto[];
}
