import { Event } from '../entities/event.entity';

export const EVENT_REPOSITORY = Symbol('IEventRepository');

export interface IEventRepository {
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  findByType(type: string): Promise<Event[]>;
  create(event: Event): Promise<Event>;
  update(id: string, event: Partial<Event>): Promise<Event | null>;
  delete(id: string): Promise<{ success: boolean; event: Event | null }>;
}
