import { ApiProperty } from '@nestjs/swagger';
import { HateoasLinkDto } from '../../interfaces/http/hateoas-link.dto';
import { TrainingModality } from '../../domain/entities/training-modality.entity';

export class MatchResponseDto {
  @ApiProperty({ example: 'uuid-do-match' })
  id: string;

  @ApiProperty({ example: 'Amistoso de Futebol' })
  title: string;

  @ApiProperty({ example: 'Partida entre Atlética A e Atlética B' })
  description: string;

  @ApiProperty({ example: 'Estádio Municipal' })
  place: string;

  @ApiProperty({ example: '2025-07-01' })
  start_date: string;

  @ApiProperty({ example: '19:00:00' })
  start_time: string;

  @ApiProperty({ example: 'Responsável pelo evento' })
  responsible: string;

  @ApiProperty({ type: () => TrainingModality })
  trainingModality: TrainingModality;

  @ApiProperty({ example: 'uuid-da-modalidade' })
  trainingModalityId: string;

  @ApiProperty({ example: '2025-06-16T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-16T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ type: [HateoasLinkDto], required: false })
  _links?: HateoasLinkDto[];
}
