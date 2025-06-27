export class DateVO {
  private readonly _value: Date;

  constructor(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    if (!this.isValid(date)) {
      throw new Error('Invalid date');
    }
    this._value = date;
  }

  get value(): Date {
    return new Date(this._value);
  }

  private isValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  isInFuture(): boolean {
    return this._value > new Date();
  }

  isInPast(): boolean {
    return this._value < new Date();
  }

  isToday(): boolean {
    const today = new Date();
    return this._value.toDateString() === today.toDateString();
  }

  equals(other: DateVO): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString();
  }

  toDateString(): string {
    return this._value.toDateString();
  }

  isBefore(other: DateVO): boolean {
    return this._value < other._value;
  }

  isAfter(other: DateVO): boolean {
    return this._value > other._value;
  }
}
