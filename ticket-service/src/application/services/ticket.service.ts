import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { ITicketRepository } from '../../domain/repositories/ticket.repository.interface';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { UpdateTicketDto } from '../dtos/update-ticket.dto';
import { Ticket, TicketStatus, TicketStatusEnum, UserTicketStatusEnum } from '../../domain/entities/ticket.entity';
import { TicketResponseDto } from '../dtos/ticket-response.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HateoasService } from './hateoas.service';

@Injectable()
export class TicketService {
  private readonly monolithServiceUrl: string;

  constructor(
    @Inject('ITicketRepository')
    private readonly ticketRepository: ITicketRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly hateoasService: HateoasService,
  ) {
    this.monolithServiceUrl = this.configService.get<string>('MONOLITH_SERVICE_URL');
    console.log(`Monolith service URL configured as: ${this.monolithServiceUrl}`);
  }

  async findAll(): Promise<{ data: TicketResponseDto[]; _links: any[] }> {
    const tickets = await this.ticketRepository.findAll();
    const dtos = tickets.map(ticket => this.mapToDto(ticket));
    return this.hateoasService.createCollectionResponse(dtos);
  }

  async findById(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    const dto = this.mapToDto(ticket);
    return this.hateoasService.addLinksToTicket(dto);
  }

  async findByEventId(eventId: string): Promise<{ data: TicketResponseDto[]; _links: any[] }> {
    // Verificar se o evento existe no monolito usando o novo endpoint com prefixo /api
    try {
      console.log(`Verificando evento ${eventId} no monolith: ${this.monolithServiceUrl}/api/microservices/events/exists/${eventId}`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/microservices/events/exists/${eventId}`)
      );
      console.log(`Evento ${eventId} encontrado no monolith: ${response.data.title}`);
    } catch (error) {
      console.error(`Erro ao verificar evento ${eventId}:`, error.message);
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const tickets = await this.ticketRepository.findByEventId(eventId);
    const dtos = tickets.map(ticket => this.mapToDto(ticket));
    return this.hateoasService.createCollectionResponse(dtos);
  }

  async findByUserId(userId: string): Promise<{ data: TicketResponseDto[]; _links: any[] }> {
    // Verificar se o usuário existe no monolito usando o novo endpoint com prefixo /api
    try {
      console.log(`Verificando usuário ${userId} no monolith: ${this.monolithServiceUrl}/api/microservices/users/exists/${userId}`);
      await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/microservices/users/exists/${userId}`)
      );
      console.log(`Usuário ${userId} encontrado no monolith`);
    } catch (error) {
      console.error(`Erro ao verificar usuário ${userId}:`, error.message);
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const tickets = await this.ticketRepository.findByUserId(userId);
    const dtos = tickets.map(ticket => this.mapToDto(ticket));
    return this.hateoasService.createCollectionResponse(dtos);
  }

  async findAvailableByEventId(eventId: string): Promise<{ data: TicketResponseDto[]; _links: any[] }> {
    // Verificar se o evento existe
    try {
      await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/microservices/events/exists/${eventId}`)
      );
    } catch (error) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const tickets = await this.ticketRepository.findAvailableByEventId(eventId);
    const dtos = tickets.map(ticket => this.mapToDto(ticket));
    return this.hateoasService.createCollectionResponse(dtos);
  }

  async create(createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
    // Verificar se o evento existe no monolito usando o novo endpoint com prefixo /api
    try {
      console.log(`Verificando evento ${createTicketDto.eventId} para criação de ticket: ${this.monolithServiceUrl}/api/microservices/events/exists/${createTicketDto.eventId}`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.monolithServiceUrl}/api/microservices/events/exists/${createTicketDto.eventId}`)
      );
      console.log(`Evento ${createTicketDto.eventId} (${response.data.title}) encontrado no monolith`);
    } catch (error) {
      console.error(`Erro ao verificar evento ${createTicketDto.eventId}:`, error.message);
      throw new NotFoundException(`Event with ID ${createTicketDto.eventId} not found`);
    }

    const ticket = new Ticket({
      ...createTicketDto,
      status: TicketStatusEnum.AVAILABLE
    });

    const createdTicket = await this.ticketRepository.create(ticket);
    const dto = this.mapToDto(createdTicket);
    return this.hateoasService.addLinksToTicket(dto);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto> {
    const existingTicket = await this.ticketRepository.findById(id);

    if (!existingTicket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    if (updateTicketDto.eventId && updateTicketDto.eventId !== existingTicket.eventId) {
      try {
        await firstValueFrom(
          this.httpService.get(`${this.monolithServiceUrl}/api/microservices/events/exists/${updateTicketDto.eventId}`)
        );
      } catch (error) {
        throw new NotFoundException(`Event with ID ${updateTicketDto.eventId} not found`);
      }
    }

    const updatedTicket = await this.ticketRepository.update(id, updateTicketDto);
    const dto = this.mapToDto(updatedTicket);
    return this.hateoasService.addLinksToTicket(dto);
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
        this.httpService.get(`${this.monolithServiceUrl}/api/microservices/users/exists/${userId}`)
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
        this.httpService.get(`${this.monolithServiceUrl}/api/microservices/users/exists/${userId}`)
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
    const dto = this.mapToDto(updatedTicket);
    return this.hateoasService.addLinksToTicket(dto);
  }

  async useTicket(id: string): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    ticket.use();
    const updatedTicket = await this.ticketRepository.update(id, ticket);
    const dto = this.mapToDto(updatedTicket);
    return this.hateoasService.addLinksToTicket(dto);
  }

  async updateTicketStatus(
    id: string,
    updateData: { status?: string; userStatus?: string; userId?: string }
  ): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    // Atualizar status do ticket se fornecido
    if (updateData.status) {
      switch (updateData.status.toLowerCase()) {
        case 'reserved':
          if (!updateData.userId) {
            throw new BadRequestException('userId is required for reserving ticket');
          }
          ticket.reserve(updateData.userId);
          break;
        case 'sold':
        case 'purchased':
          if (!updateData.userId) {
            throw new BadRequestException('userId is required for purchasing ticket');
          }
          ticket.purchase(updateData.userId);
          break;
        case 'cancelled':
          ticket.cancel();
          break;
        case 'used':
          ticket.use();
          break;
        case 'available':
          ticket.makeAvailable();
          break;
        default:
          throw new BadRequestException(`Invalid status: ${updateData.status}`);
      }
    }

    // Atualizar userStatus diretamente se fornecido
    if (updateData.userStatus) {
      const validUserStatuses = Object.values(UserTicketStatusEnum);
      if (!validUserStatuses.includes(updateData.userStatus as UserTicketStatusEnum)) {
        throw new BadRequestException(`Invalid userStatus: ${updateData.userStatus}`);
      }
      ticket.userStatus = updateData.userStatus as UserTicketStatusEnum;

      // Marcar como usado se userStatus for 'used'
      if (updateData.userStatus === UserTicketStatusEnum.USED) {
        ticket.usedAt = new Date();
      }

      ticket.updatedAt = new Date();
    }

    const updatedTicket = await this.ticketRepository.update(id, ticket);
    const dto = this.mapToDto(updatedTicket);
    return this.hateoasService.addLinksToTicket(dto);
  }

  private mapToDto(ticket: Ticket): TicketResponseDto {
    const dto = new TicketResponseDto();
    dto.id = ticket.id;
    dto.name = ticket.name;
    dto.description = ticket.description;
    dto.price = ticket.price;
    dto.status = ticket.status;
    dto.userStatus = ticket.userStatus;
    dto.eventId = ticket.eventId;
    dto.userId = ticket.userId;
    dto.purchasedAt = ticket.purchasedAt;
    dto.usedAt = ticket.usedAt;
    dto.expiresAt = ticket.expiresAt;
    dto.createdAt = ticket.createdAt;
    dto.updatedAt = ticket.updatedAt;
    return dto;
  }
}
