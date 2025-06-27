import { DomainEvent } from '../events/base-domain.event';

export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected markEventsForDispatch(): void {
    // This would typically integrate with an event dispatcher
    // For now, we just mark them as ready for dispatch
  }
}
