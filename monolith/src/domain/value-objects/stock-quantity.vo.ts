export class StockQuantity {
  private readonly _value: number;

  constructor(value: number) {
    if (!this.isValid(value)) {
      throw new Error('Stock quantity must be a non-negative integer');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  private isValid(value: number): boolean {
    return Number.isInteger(value) && value >= 0;
  }

  canReduce(quantity: number): boolean {
    return this._value >= quantity;
  }

  add(quantity: StockQuantity): StockQuantity {
    return new StockQuantity(this._value + quantity._value);
  }

  subtract(quantity: StockQuantity): StockQuantity {
    return new StockQuantity(this._value - quantity._value);
  }

  isOutOfStock(): boolean {
    return this._value === 0;
  }

  isLowStock(threshold: number = 5): boolean {
    return this._value <= threshold && this._value > 0;
  }

  equals(other: StockQuantity): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
}
