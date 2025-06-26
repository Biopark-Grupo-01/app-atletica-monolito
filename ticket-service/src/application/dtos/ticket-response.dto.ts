import { ApiProperty } from '@nestjs/swagger';
import { TicketStatusEnum, UserTicketStatusEnum } from "../../domain/entities/ticket.entity";
import { HateoasLinkDto } from './hateoas-link.dto';

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
    description: 'Status do ticket (disponibilidade)',
    enum: TicketStatusEnum,
    example: TicketStatusEnum.AVAILABLE,
  })
  status: TicketStatusEnum;

  @ApiProperty({
    description: 'Status do usuário (pagamento/validade)',
    enum: UserTicketStatusEnum,
    example: UserTicketStatusEnum.NOT_PAID,
    required: false,
  })
  userStatus?: UserTicketStatusEnum;

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
    description: 'Data de uso do ticket',
    example: '2023-12-01T18:30:00Z',
    required: false,
  })
  usedAt?: Date;

  @ApiProperty({
    description: 'Data de expiração do ticket',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  expiresAt?: Date;

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

  @ApiProperty({
    description: 'Links HATEOAS para ações disponíveis',
    type: [HateoasLinkDto],
    required: false,
  })
  _links?: HateoasLinkDto[];
}
