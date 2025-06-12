import { IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';

export class CreateTrainingUserDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID do usuário inscrito',
    example: '3e66159f-efaa-4c74-8bce-51c1fef3622e',
  })
  userId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID do treino no qual o usuário está inscrito',
    example: '912bc907-2da7-4411-a537-4a11c6b711ed',
  })
  trainingId: string;
}

export class TrainingUserResponseDto {
  @ApiProperty({
    description: 'ID único da inscrição',
    example: '8a13eebf-2f21-44b8-91c2-3a2a5cb6d5ae',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário inscrito',
    example: '3e66159f-efaa-4c74-8bce-51c1fef3622e',
  })
  userId: string;

  @ApiProperty({
    description: 'ID do treino no qual o usuário está inscrito',
    example: '912bc907-2da7-4411-a537-4a11c6b711ed',
  })
  trainingId: string;

  @ApiProperty({
    description: 'Data de criação da inscrição',
    example: '2025-06-10T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização da inscrição',
    example: '2025-06-10T12:00:00Z',
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'Links HATEOAS',
    type: () => [HateoasLinkDto],
  })
  _links?: HateoasLinkDto[];
}
