import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}