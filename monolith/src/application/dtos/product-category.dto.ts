import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria do produto',
    example: 'Camisetas',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Ícone da categoria do produto',
    example: 'tshirt',
  })
  icon?: string;
}

export class UpdateProductCategoryDto {
  @ApiPropertyOptional({
    description: 'Nome da categoria do produto',
    example: 'Camisetas Esportivas',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Ícone da categoria do produto',
    example: 'sports_tshirt',
  })
  icon?: string;
}

export class ProductCategoryResponseDto {
  @ApiProperty({
    description: 'ID único da categoria do produto',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da categoria do produto',
    example: 'Camisetas',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Ícone da categoria do produto',
    example: 'tshirt',
  })
  icon?: string;
}
