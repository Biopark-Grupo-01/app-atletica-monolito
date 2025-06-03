import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITicketRepository } from '../../domain/repositories/ticket.repository.interface';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { UpdateTicketDto } from '../dtos/update-ticket.dto';
import { Ticket, TicketStatus } from '../../domain/entities/ticket.entity';
import { TicketResponseDto } from '../dtos/ticket-response.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketService {
  private readonly monolithServiceUrl: string;

  constructor(
    @Inject('ITicketRepository')
    private readonly ticketRepository: ITicketRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.monolithServiceUrl = this.configService.get<string>('MONOLITH_SERVICE_URL');
  }

  async findAll(): Promise<TicketResponseDto[]> {
    const tickets = await this.ticketRepository.findAll();
    return tickets.map(ticket => this.mapToDto(ticket));
  }

  async findById(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    return this.mapToDto(ticket);
  }

  async findByEventId(eventId: string): Promise<TicketResponseDto[]> {
    // Verificar se o evento existe no monolito
    try {
      await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/events/${eventId}`)
      );
    } catch (error) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const tickets = await this.ticketRepository.findByEventId(eventId);
    return tickets.map(ticket => this.mapToDto(ticket));
  }

  async findByUserId(userId: string): Promise<TicketResponseDto[]> {
    // Verificar se o usuário existe no monolito
    try {
      await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/users/${userId}`)
      );
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const tickets = await this.ticketRepository.findByUserId(userId);
    return tickets.map(ticket => this.mapToDto(ticket));
  }

  async findAvailableByEventId(eventId: string): Promise<TicketResponseDto[]> {
    const tickets = await this.ticketRepository.findAvailableByEventId(eventId);
    return tickets.map(ticket => this.mapToDto(ticket));
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
    // Verificar se o evento existe no monolito
    try {
      await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/events/${createTicketDto.eventId}`)
      );
    } catch (error) {
      throw new NotFoundException(`Event with ID ${createTicketDto.eventId} not found`);
    }

    const ticket = new Ticket({
      ...createTicketDto,
      status: TicketStatus.AVAILABLE
    });
    
    const createdTicket = await this.ticketRepository.create(ticket);
    return this.mapToDto(createdTicket);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto> {
    const existingTicket = await this.ticketRepository.findById(id);
    
    if (!existingTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    if (updateTicketDto.eventId && updateTicketDto.eventId !== existingTicket.eventId) {
      try {
        await firstValueFrom(
          this.httpService.get(`${this.monolithServiceUrl}/api/events/${updateTicketDto.eventId}`)
        );
      } catch (error) {
        throw new NotFoundException(`Event with ID ${updateTicketDto.eventId} not found`);
      }
    }
    
    const updatedTicket = await this.ticketRepository.update(id, updateTicketDto);
    return this.mapToDto(updatedTicket);
  }

  async delete(id: string): Promise<void> {
    const existingTicket = await this.ticketRepository.findById(id);
    
    if (!existingTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    await this.ticketRepository.delete(id);
  }

  async reserveTicket(id: string, userId: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    try {
      await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/users/${userId}`)
      );
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    ticket.reserve(userId);
    const updatedTicket = await this.ticketRepository.update(id, ticket);
    return this.mapToDto(updatedTicket);
  }

  async purchaseTicket(id: string, userId: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    try {
      await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/users/${userId}`)
      );
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    ticket.purchase(userId);
    const updatedTicket = await this.ticketRepository.update(id, ticket);
    return this.mapToDto(updatedTicket);
  }

  async cancelTicket(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);
    
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    ticket.cancel();
    const updatedTicket = await this.ticketRepository.update(id, ticket);
    return this.mapToDto(updatedTicket);
  }

  private mapToDto(ticket: Ticket): TicketResponseDto {
    const dto = new TicketResponseDto();
    dto.id = ticket.id;
    dto.name = ticket.name;
    dto.description = ticket.description;
    dto.price = ticket.price;
    dto.status = ticket.status;
    dto.eventId = ticket.eventId;
    dto.userId = ticket.userId;
    dto.purchasedAt = ticket.purchasedAt;
    dto.createdAt = ticket.createdAt;
    dto.updatedAt = ticket.updatedAt;
    return dto;
  }
}