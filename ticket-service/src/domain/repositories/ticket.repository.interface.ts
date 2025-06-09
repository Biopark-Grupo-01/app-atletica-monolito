import { Ticket } from '../entities/ticket.entity';

export interface ITicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket>;
  findByEventId(eventId: string): Promise<Ticket[]>;
  findByUserId(userId: string): Promise<Ticket[]>;
  findAvailableByEventId(eventId: string): Promise<Ticket[]>;
  create(ticket: Ticket): Promise<Ticket>;
  update(id: string, ticket: Partial<Ticket>): Promise<Ticket>;
  delete(id: string): Promise<void>;
}