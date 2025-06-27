import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Event, EventType } from '../../domain/entities/event.entity';
import {
  IEventRepository,
  EVENT_REPOSITORY,
} from '../../domain/repositories/event.repository.interface';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './user.service';
import { NotificationService } from '../../modules/notification/notification.service';
import { TicketGatewayService } from '../../modules/gateway/services/ticket-gateway.service';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private eventRepository: IEventRepository,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly ticketGatewayService: TicketGatewayService,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findByType(type: string): Promise<Event[]> {
    if (!Object.values(EventType).includes(type as EventType)) {
      throw new NotFoundException(`Event type ${type} is not valid`);
    }
    return this.eventRepository.findByType(type);
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = new Event({
      id: uuidv4(),
      ...createEventDto,
    });

    const createdEvent = await this.eventRepository.create(event);

    // Criar ticket automaticamente para o evento
    try {
      const ticketData = {
        name: `Ingresso - ${createdEvent.title}`,
        description: `Ingresso para o evento: ${createdEvent.description}`,
        price: Number(createdEvent.price) || 0, // Garantir que seja número
        eventId: createdEvent.id,
      };

      for (let i = 0; i < 50; i++) {
        await this.ticketGatewayService.proxyRequest('POST', '', ticketData);
      }
      console.log(
        `Ticket criado automaticamente para o evento: ${createdEvent.title}`,
      );
    } catch (error) {
      console.error(
        `Erro ao criar ticket para o evento ${createdEvent.title}:`,
        error,
      );
      // Não falha a criação do evento se o ticket falhar
    }

    const users = await this.userService.findAll();
    const rolesToExclude = ['DIRECTOR', 'ADMIN'];
    const usersToNotify = users.filter(
      (user) => user.role && !rolesToExclude.includes(user.role.name),
    );

    const fcmTokens = usersToNotify
      .map((user) => user.fcmToken)
      .filter((token): token is string => !!token);

    if (fcmTokens.length > 0) {
      this.notificationService.broadcastNotification(
        fcmTokens,
        `Novo Evento: ${createdEvent.title}`,
        createdEvent.description,
      );
    }

    return createdEvent;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const updatedEvent = await this.eventRepository.update(id, updateEventDto);
    if (!updatedEvent) {
      throw new NotFoundException(`Failed to update event with ID ${id}`);
    }

    return updatedEvent;
  }

  async delete(
    id: string,
  ): Promise<{ success: boolean; eventId: string; eventTitle: string | null }> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const result = await this.eventRepository.delete(id);
    return {
      success: result.success,
      eventId: id,
      eventTitle: result.event?.title || null,
    };
  }
}
