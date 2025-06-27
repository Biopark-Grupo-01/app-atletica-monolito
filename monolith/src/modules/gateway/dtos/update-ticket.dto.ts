import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { TicketStatusEnum } from './ticket-response.dto';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'Nome do ticket',
    example: 'Ingresso VIP Atualizado',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descrição do ticket',
    example: 'Nova descrição do ticket',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Preço do ticket',
    example: 120.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Status do ticket',
    enum: TicketStatusEnum,
    example: TicketStatusEnum.AVAILABLE,
    required: false,
  })
  @IsEnum(TicketStatusEnum)
  @IsOptional()
  status?: TicketStatusEnum;
}
