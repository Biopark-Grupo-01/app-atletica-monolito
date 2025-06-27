export class TrainingSchedule {
  private readonly _startDate: Date;
  private readonly _startTime: string;
  private readonly _duration: number; // in minutes
  private readonly _dayOfWeek: DayOfWeek;

  constructor(startDate: Date, startTime: string, duration: number) {
    this.validateInputs(startDate, startTime, duration);

    this._startDate = new Date(startDate);
    this._startTime = this.formatTime(startTime);
    this._duration = duration;
    this._dayOfWeek = this.getDayOfWeek(startDate);
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get startTime(): string {
    return this._startTime;
  }

  get duration(): number {
    return this._duration;
  }

  get dayOfWeek(): DayOfWeek {
    return this._dayOfWeek;
  }

  get endTime(): string {
    const startTimeMinutes = this.timeToMinutes(this._startTime);
    const endTimeMinutes = startTimeMinutes + this._duration;
    return this.minutesToTime(endTimeMinutes);
  }

  get endDate(): Date {
    const endDate = new Date(this._startDate);
    endDate.setMinutes(endDate.getMinutes() + this._duration);
    return endDate;
  }

  private validateInputs(
    startDate: Date,
    startTime: string,
    duration: number,
  ): void {
    if (!startDate || isNaN(startDate.getTime())) {
      throw new Error('Invalid start date');
    }

    if (!this.isValidTimeFormat(startTime)) {
      throw new Error('Invalid time format. Use HH:MM');
    }

    if (duration <= 0 || duration > 480) {
      // max 8 hours
      throw new Error('Duration must be between 1 and 480 minutes');
    }
  }

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    return days[date.getDay()] as DayOfWeek;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  isConflictingWith(other: TrainingSchedule): boolean {
    if (this._dayOfWeek !== other._dayOfWeek) {
      return false;
    }

    const thisStart = this.timeToMinutes(this._startTime);
    const thisEnd = thisStart + this._duration;
    const otherStart = other.timeToMinutes(other._startTime);
    const otherEnd = otherStart + other._duration;

    return !(thisEnd <= otherStart || otherEnd <= thisStart);
  }

  reschedule(newStartDate: Date, newStartTime: string): TrainingSchedule {
    return new TrainingSchedule(newStartDate, newStartTime, this._duration);
  }

  equals(other: TrainingSchedule): boolean {
    return (
      this._startDate.getTime() === other._startDate.getTime() &&
      this._startTime === other._startTime &&
      this._duration === other._duration
    );
  }

  toString(): string {
    return `${this._dayOfWeek} ${this._startTime} - ${this.endTime} (${this._duration}min)`;
  }
}

export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}
