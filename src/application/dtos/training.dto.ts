/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiProperty({ description: 'Título do treino', example: 'Treino Funcional' })
  title: string;

  @ApiProperty({
    description: 'Descrição do treino',
    example: 'Treino focado em resistência e força',
  })
  description: string;

  @ApiProperty({ description: 'Modalidade do treino', example: 'Presencial' })
  modality: string;

  @ApiProperty({ description: 'Local do treino', example: 'Academia Atlética' })
  place: string;

  @ApiProperty({ description: 'Data do treino', example: '2025-06-01' })
  start_date: string;

  @ApiProperty({ description: 'Hora de início do treino', example: '18:00' })
  start_time: string;

  @ApiProperty({ description: 'Nome do treinador', example: 'João Silva' })
  coach: string;

  @ApiProperty({
    description: 'Nome do responsável pelo treino',
    example: 'Lucas Furini',
  })
  responsible: string;
}

export class UpdateTrainingDto {
  @ApiPropertyOptional({
    description: 'Título do treino',
    example: 'Treino Funcional Avançado',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição do treino',
    example: 'Treino focado em resistência e força avançada',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Modalidade do treino',
    example: 'Online',
  })
  modality?: string;

  @ApiPropertyOptional({
    description: 'Local do treino',
    example: 'Academia Atlética',
  })
  place?: string;

  @ApiPropertyOptional({ description: 'Data do treino', example: '2025-06-01' })
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Hora de início do treino',
    example: '18:00',
  })
  start_time?: string;

  @ApiPropertyOptional({
    description: 'Nome do treinador',
    example: 'João Silva',
  })
  coach?: string;

  @ApiPropertyOptional({
    description: 'Nome do responsável pelo treino',
    example: 'Lucas Furini',
  })
  responsible?: string;
}

export class TrainingResponseDto {
  @ApiProperty({
    description: 'ID único do treino',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Título do treino', example: 'Treino Funcional' })
  title: string;

  @ApiProperty({
    description: 'Descrição do treino',
    example: 'Treino focado em resistência e força',
  })
  description: string;

  @ApiProperty({ description: 'Modalidade do treino', example: 'Presencial' })
  modality: string;

  @ApiProperty({ description: 'Local do treino', example: 'Academia Atlética' })
  place: string;

  @ApiProperty({ description: 'Data do treino', example: '2025-06-01' })
  start_date: string;

  @ApiProperty({ description: 'Hora de início do treino', example: '18:00' })
  start_time: string;

  @ApiProperty({ description: 'Nome do treinador', example: 'João Silva' })
  coach: string;

  @ApiProperty({
    description: 'Nome do responsável pelo treino',
    example: 'Lucas Furini',
  })
  responsible: string;

  @ApiProperty({
    description: 'Data de criação do treino',
    example: '2025-05-22T10:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização do treino',
    example: '2025-05-22T10:00:00Z',
  })
  updated_at: Date;
}
