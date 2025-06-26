import { BaseDomainEvent } from './base-domain.event';

export class EventCreatedEvent extends BaseDomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly title: string,
    public readonly date: Date,
    public readonly type: string,
    public readonly price: number,
  ) {
    super('EventCreated');
  }
}

export class EventRescheduledEvent extends BaseDomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly previousDate: Date,
    public readonly newDate: Date,
  ) {
    super('EventRescheduled');
  }
}

export class EventCancelledEvent extends BaseDomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly reason: string,
  ) {
    super('EventCancelled');
  }
}
