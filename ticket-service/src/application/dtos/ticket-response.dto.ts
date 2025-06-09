import { TicketStatus } from "../../domain/entities/ticket.entity";

export class TicketResponseDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: TicketStatus;
  eventId: string;
  userId?: string;
  purchasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}