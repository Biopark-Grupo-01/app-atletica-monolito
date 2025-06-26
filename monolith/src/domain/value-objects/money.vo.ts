export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'BRL') {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    this._amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
    this._currency = currency;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract different currencies');
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  isGreaterThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this._amount > other._amount;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
