import { ApiProperty } from '@nestjs/swagger';

export enum TicketStatusEnum {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  CANCELLED = 'cancelled',
}

export class TicketResponseDto {
  @ApiProperty({
    description: 'ID único do ticket',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Nome do ticket', example: 'Ingresso VIP' })
  name: string;

  @ApiProperty({
    description: 'Descrição do ticket',
    example: 'Acesso VIP ao evento',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'Preço do ticket', example: 100.0 })
  price: number;

  @ApiProperty({
    description: 'Status do ticket',
    enum: TicketStatusEnum,
    example: TicketStatusEnum.AVAILABLE,
  })
  status: TicketStatusEnum;

  @ApiProperty({
    description: 'ID do evento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  eventId: string;

  @ApiProperty({
    description: 'ID do usuário (se comprado)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Data da compra',
    example: '2023-12-01T10:00:00Z',
    required: false,
  })
  purchasedAt?: Date;

  @ApiProperty({
    description: 'Data de criação',
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2023-12-01T10:00:00Z',
  })
  updatedAt: Date;
}
