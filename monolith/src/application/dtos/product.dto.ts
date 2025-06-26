import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camisa da Atlética',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camisa oficial da Atlética 2025',
  })
  description: string;

  @ApiProperty({ description: 'Preço do produto', example: 59.9 })
  price: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
  stock: number;

  @ApiPropertyOptional({
    description: 'URL da imagem do produto',
    example:
      '/uploads/products/product-123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  imageUrl?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nome do produto',
    example: 'Camisa da Atlética Edição Limitada',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do produto',
    example: 'Edição especial da camisa oficial',
  })
  description?: string;

  @ApiPropertyOptional({ description: 'Preço do produto', example: 79.9 })
  price?: number;

  @ApiPropertyOptional({ description: 'Quantidade em estoque', example: 50 })
  stock?: number;

  @ApiPropertyOptional({
    description: 'URL da imagem do produto',
    example:
      '/uploads/products/product-123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  imageUrl?: string;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camisa da Atlética',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camisa oficial da Atlética 2025',
  })
  description: string;

  @ApiProperty({ description: 'Preço do produto', example: 59.9 })
  price: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
  stock: number;

  @ApiPropertyOptional({
    description: 'URL da imagem do produto',
    example:
      '/uploads/products/product-123e4567-e89b-12d3-a456-426614174000.jpg',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-05-22T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-05-22T10:00:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Links HATEOAS para o produto',
    type: [HateoasLinkDto], // Corrected to use the DTO
  })
  _links?: HateoasLinkDto[];

  @ApiProperty({
    description: 'ID da categoria do produto',
    example: '5dd39c1a-7cca-4037-be86-40dfd832b467',
    required: false,
  })
  categoryId?: string;
}
