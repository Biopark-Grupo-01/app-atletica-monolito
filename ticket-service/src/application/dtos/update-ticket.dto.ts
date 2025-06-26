import { IsDecimal, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TicketStatusEnum } from '../../domain/entities/ticket.entity';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  price?: number;
  
  @IsOptional()
  @IsEnum(TicketStatusEnum)
  status?: TicketStatusEnum;

  @IsOptional()
  @IsUUID()
  eventId?: string;
}