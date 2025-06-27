import { BaseDomainEvent } from './base-domain.event';

export class ProductOutOfStockEvent extends BaseDomainEvent {
  constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly categoryId: string,
  ) {
    super('ProductOutOfStock');
  }
}

export class ProductLowStockEvent extends BaseDomainEvent {
  constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly currentStock: number,
    public readonly threshold: number,
  ) {
    super('ProductLowStock');
  }
}

export class ProductCreatedEvent extends BaseDomainEvent {
  constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly categoryId: string,
  ) {
    super('ProductCreated');
  }
}

export class ProductStockUpdatedEvent extends BaseDomainEvent {
  constructor(
    public readonly productId: string,
    public readonly previousStock: number,
    public readonly newStock: number,
    public readonly operation: 'ADD' | 'REDUCE' | 'SET',
  ) {
    super('ProductStockUpdated');
  }
}
