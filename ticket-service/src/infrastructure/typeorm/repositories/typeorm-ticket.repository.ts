import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../../../domain/entities/ticket.entity';
import { ITicketRepository } from '../../../domain/repositories/ticket.repository.interface';

@Injectable()
export class TypeOrmTicketRepository implements ITicketRepository {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  async findById(id: string): Promise<Ticket> {
    return this.ticketRepository.findOne({ where: { id } });
  }

  async findByEventId(eventId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({ where: { eventId } });
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({ where: { userId } });
  }

  async findAvailableByEventId(eventId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({ 
      where: { 
        eventId, 
        status: TicketStatus.AVAILABLE 
      } 
    });
  }

  async create(ticket: Ticket): Promise<Ticket> {
    return this.ticketRepository.save(ticket);
  }

  async update(id: string, ticketData: Partial<Ticket>): Promise<Ticket> {
    await this.ticketRepository.update(id, ticketData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.ticketRepository.delete(id);
  }
}