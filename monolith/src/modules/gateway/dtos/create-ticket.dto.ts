import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ description: 'Nome do ticket', example: 'Ingresso VIP' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descrição do ticket',
    example: 'Acesso VIP ao evento',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Preço do ticket', example: 100.0 })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'ID do evento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  eventId: string;
}
