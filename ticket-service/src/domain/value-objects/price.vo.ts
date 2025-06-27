export class Price {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'BRL') {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
    this._amount = Math.round(amount * 100) / 100;
    this._currency = currency;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  isFree(): boolean {
    return this._amount === 0;
  }

  add(other: Price): Price {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new Price(this._amount + other._amount, this._currency);
  }

  multiply(factor: number): Price {
    return new Price(this._amount * factor, this._currency);
  }

  isGreaterThan(other: Price): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this._amount > other._amount;
  }

  equals(other: Price): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
