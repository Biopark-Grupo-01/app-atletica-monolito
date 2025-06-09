import { IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}