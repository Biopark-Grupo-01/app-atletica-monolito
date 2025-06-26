export enum TicketStatusEnum {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  USED = 'used',
  CANCELLED = 'cancelled',
}

export class TicketStatus {
  private readonly _value: TicketStatusEnum;

  constructor(value: TicketStatusEnum) {
    this._value = value;
  }

  get value(): TicketStatusEnum {
    return this._value;
  }

  static available(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.AVAILABLE);
  }

  static reserved(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.RESERVED);
  }

  static sold(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.SOLD);
  }

  static cancelled(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.CANCELLED);
  }

  static used(): TicketStatus {
    return new TicketStatus(TicketStatusEnum.USED);
  }

  isAvailable(): boolean {
    return this._value === TicketStatusEnum.AVAILABLE;
  }

  isReserved(): boolean {
    return this._value === TicketStatusEnum.RESERVED;
  }

  isSold(): boolean {
    return this._value === TicketStatusEnum.SOLD;
  }

  isCancelled(): boolean {
    return this._value === TicketStatusEnum.CANCELLED;
  }

  isUsed(): boolean {
    return this._value === TicketStatusEnum.USED;
  }

  canBeUsed(): boolean {
    return this._value === TicketStatusEnum.SOLD;
  }

  canBeReserved(): boolean {
    return this._value === TicketStatusEnum.AVAILABLE;
  }

  canBePurchased(): boolean {
    return this._value === TicketStatusEnum.AVAILABLE || this._value === TicketStatusEnum.RESERVED;
  }

  canBeCancelled(): boolean {
    return this._value !== TicketStatusEnum.CANCELLED && this._value !== TicketStatusEnum.USED;
  }

  equals(other: TicketStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
