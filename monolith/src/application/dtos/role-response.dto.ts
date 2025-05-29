import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';

export class RoleResponseDto {
  @ApiProperty({ description: 'ID da role', example: 'some-uuid-string' })
  id: string;

  @ApiProperty({ description: 'Nome da role', example: 'Administrator' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da role',
    example: 'Manages all system settings and users',
  })
  description?: string;

  @ApiProperty({ description: 'Data de criação da role' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização da role' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Links HATEOAS para a role',
    type: [HateoasLinkDto],
  })
  _links?: HateoasLinkDto[];
}
