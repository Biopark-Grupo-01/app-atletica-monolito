import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';
import { RoleResponseDto } from './role-response.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário', example: 'user-uuid-string' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'John Doe' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento do usuário',
    example: '1990-01-01',
  })
  birthDate?: Date;

  @ApiProperty({ description: 'Data de criação do usuário' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do usuário' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Links HATEOAS para o usuário',
    type: [HateoasLinkDto],
  })
  _links?: HateoasLinkDto[];

  @ApiPropertyOptional({ description: 'Número de registro do usuário' })
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'CPF do usuário' })
  cpf?: string;

  @ApiPropertyOptional({ description: 'Telefone do usuário' })
  phone?: string;

  @ApiProperty({ description: 'Papel do usuário', type: () => RoleResponseDto })
  role: RoleResponseDto; // Role is expected to be populated

  @ApiPropertyOptional({ description: 'ID do usuário no Google' })
  googleId?: string;

  @ApiPropertyOptional({ description: 'URL da foto de perfil do usuário' })
  profilePictureUrl?: string;

  @ApiPropertyOptional({ description: 'Token FCM do usuário' })
  fcmToken?: string;
}
