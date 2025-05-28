import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventType } from '../../../domain/entities/event.entity';
import { EventRepository } from '../../../domain/repositories/event.repository.interface';

@Injectable()
export class TypeOrmEventRepository implements EventRepository {
  private readonly logger = new Logger(TypeOrmEventRepository.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventRepository.findOneBy({ id });
  }

  async findByType(type: string): Promise<Event[]> {
    // Convertendo a string para o tipo enum EventType
    const eventType = type as EventType;
    return this.eventRepository.findBy({ type: eventType });
  }

  async create(event: Event): Promise<Event> {
    return this.eventRepository.save(event);
  }

  async update(
    id: string,
    eventData: Partial<Event>,
  ): Promise<Event | null> {
    await this.eventRepository.update(id, eventData);
    return this.findById(id);
  }

  async delete(
    id: string,
  ): Promise<{ success: boolean; event: Event | null }> {
    try {
      // Buscar o evento antes de deletar
      const event = await this.findById(id);
      this.logger.log(`Attempting to delete event with ID: ${id}`);

      if (!event) {
        this.logger.warn(`Event with ID ${id} not found for deletion`);
        return { success: false, event: null };
      }

      this.logger.log(`Found event to delete: ${JSON.stringify(event)}`);

      // Usar o método remove para garantir que os eventos de ciclo de vida sejam acionados
      await this.eventRepository.remove(event);

      // Verificar se o evento foi realmente excluído
      const checkIfDeleted = await this.findById(id);
      const success = checkIfDeleted === null;

      this.logger.log(`Deletion success: ${success}`);

      return {
        success,
        event,
      };
    } catch (error) {
      this.logger.error(`Error deleting event: ${error.message}`, error.stack);
      return { success: false, event: null };
    }
  }
}