import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
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

  @ApiProperty({ example: 'uuid-da-modalidade' })
  trainingModalityId: string;
}
