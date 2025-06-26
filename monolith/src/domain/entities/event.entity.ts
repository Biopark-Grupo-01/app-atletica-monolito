import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Money } from '../value-objects/money.vo';
import { EventDate } from '../value-objects/event-date.vo';
import { AggregateRoot } from '../aggregates/aggregate-root';
import {
  EventCreatedEvent,
  EventRescheduledEvent,
  EventCancelledEvent,
} from '../events/event.events';

export enum EventType {
  PARTY = 'party',
  SPORTS = 'sports',
  ACADEMIC = 'academic',
  CULTURAL = 'cultural',
  OTHER = 'other',
}

@Entity('events')
export class Event extends AggregateRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.OTHER,
  })
  type: EventType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Event>) {
    super();
    Object.assign(this, partial);
  }

  // Value Object methods
  setPrice(amount: number, currency: string = 'BRL'): void {
    const money = new Money(amount, currency);
    this.price = money.amount;
  }

  setDate(date: Date): void {
    const dateVO = new EventDate(date);
    this.date = dateVO.value;
  }

  updatePrice(price: number): void {
    const money = new Money(price);
    this.price = money.amount;
  }

  // Domain methods
  isUpcoming(): boolean {
    const dateVO = new EventDate(this.date);
    return dateVO.isInFuture();
  }

  isPast(): boolean {
    const dateVO = new EventDate(this.date);
    return dateVO.isInPast();
  }

  isToday(): boolean {
    const dateVO = new EventDate(this.date);
    return dateVO.isToday();
  }

  updateDetails(title?: string, description?: string, location?: string): void {
    if (title && title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    if (title) this.title = title.trim();
    if (description) this.description = description;
    if (location) this.location = location;
  }

  reschedule(newDate: Date): void {
    if (newDate <= new Date()) {
      throw new Error('Event date must be in the future');
    }
    const previousDate = this.date;
    this.date = newDate;

    this.addDomainEvent(
      new EventRescheduledEvent(this.id, previousDate, newDate),
    );
  }

  cancel(reason: string): void {
    this.addDomainEvent(new EventCancelledEvent(this.id, reason));
  }

  // Static factory method for creating new events
  static create(
    title: string,
    description: string,
    date: Date,
    location: string,
    price: number,
    type: EventType,
  ): Event {
    const event = new Event({
      title,
      description,
      date,
      location,
      price,
      type,
    });

    event.addDomainEvent(
      new EventCreatedEvent(event.id, title, date, type, price),
    );

    return event;
  }

  isFree(): boolean {
    return this.price === 0;
  }
}
