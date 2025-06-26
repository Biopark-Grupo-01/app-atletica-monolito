export enum UserTicketStatusEnum {
  NOT_PAID = 'not_paid',
  PAID = 'paid',
  USED = 'used',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export class UserTicketStatus {
  private readonly _value: UserTicketStatusEnum;

  constructor(value: UserTicketStatusEnum) {
    this._value = value;
  }

  get value(): UserTicketStatusEnum {
    return this._value;
  }

  static notPaid(): UserTicketStatus {
    return new UserTicketStatus(UserTicketStatusEnum.NOT_PAID);
  }

  static paid(): UserTicketStatus {
    return new UserTicketStatus(UserTicketStatusEnum.PAID);
  }

  static used(): UserTicketStatus {
    return new UserTicketStatus(UserTicketStatusEnum.USED);
  }

  static expired(): UserTicketStatus {
    return new UserTicketStatus(UserTicketStatusEnum.EXPIRED);
  }

  static cancelled(): UserTicketStatus {
    return new UserTicketStatus(UserTicketStatusEnum.CANCELLED);
  }

  static refunded(): UserTicketStatus {
    return new UserTicketStatus(UserTicketStatusEnum.REFUNDED);
  }

  isPaid(): boolean {
    return this._value === UserTicketStatusEnum.PAID;
  }

  isUsed(): boolean {
    return this._value === UserTicketStatusEnum.USED;
  }

  isExpired(): boolean {
    return this._value === UserTicketStatusEnum.EXPIRED;
  }

  isCancelled(): boolean {
    return this._value === UserTicketStatusEnum.CANCELLED;
  }

  isRefunded(): boolean {
    return this._value === UserTicketStatusEnum.REFUNDED;
  }

  isNotPaid(): boolean {
    return this._value === UserTicketStatusEnum.NOT_PAID;
  }

  isValid(): boolean {
    return this._value === UserTicketStatusEnum.PAID;
  }

  canBePaid(): boolean {
    return this._value === UserTicketStatusEnum.NOT_PAID;
  }

  canBeUsed(): boolean {
    return this._value === UserTicketStatusEnum.PAID;
  }

  canBeCancelled(): boolean {
    return this._value === UserTicketStatusEnum.NOT_PAID || this._value === UserTicketStatusEnum.PAID;
  }

  canBeRefunded(): boolean {
    return this._value === UserTicketStatusEnum.PAID || this._value === UserTicketStatusEnum.USED;
  }

  canExpire(): boolean {
    return this._value === UserTicketStatusEnum.NOT_PAID || this._value === UserTicketStatusEnum.PAID;
  }

  equals(other: UserTicketStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}