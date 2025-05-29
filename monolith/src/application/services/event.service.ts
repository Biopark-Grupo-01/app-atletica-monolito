import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Event, EventType } from '../../domain/entities/event.entity';
import { EventRepository, EVENT_REPOSITORY } from '../../domain/repositories/event.repository.interface';
import { CreateEventDto, UpdateEventDto } from '../dtos/event.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private eventRepository: EventRepository
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
    
    return this.eventRepository.create(event);
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

  async delete(id: string): Promise<{ success: boolean; eventId: string; eventTitle: string | null }> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const result = await this.eventRepository.delete(id);
    return { 
      success: result.success,
      eventId: id,
      eventTitle: result.event?.title || null
    };
  }
}