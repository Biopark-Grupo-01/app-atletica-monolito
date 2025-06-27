export class EventDate {
  private readonly _date: Date;

  constructor(date: Date) {
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    this._date = new Date(date);
  }

  get value(): Date {
    return new Date(this._date);
  }

  isInFuture(): boolean {
    return this._date > new Date();
  }

  isInPast(): boolean {
    return this._date < new Date();
  }

  isToday(): boolean {
    const today = new Date();
    return (
      this._date.getDate() === today.getDate() &&
      this._date.getMonth() === today.getMonth() &&
      this._date.getFullYear() === today.getFullYear()
    );
  }

  isThisWeek(): boolean {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return this._date >= startOfWeek && this._date <= endOfWeek;
  }

  isThisMonth(): boolean {
    const today = new Date();
    return (
      this._date.getMonth() === today.getMonth() &&
      this._date.getFullYear() === today.getFullYear()
    );
  }

  daysBetween(other: EventDate): number {
    const diffTime = Math.abs(this._date.getTime() - other._date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  addDays(days: number): EventDate {
    const newDate = new Date(this._date);
    newDate.setDate(newDate.getDate() + days);
    return new EventDate(newDate);
  }

  format(locale: string = 'pt-BR'): string {
    return this._date.toLocaleDateString(locale);
  }

  formatWithTime(locale: string = 'pt-BR'): string {
    return this._date.toLocaleString(locale);
  }

  equals(other: EventDate): boolean {
    return this._date.getTime() === other._date.getTime();
  }

  toString(): string {
    return this._date.toISOString();
  }
}
