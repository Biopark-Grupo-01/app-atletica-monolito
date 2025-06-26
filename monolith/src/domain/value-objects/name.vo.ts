export class Name {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(
        'Name cannot be empty and must have at least 2 characters',
      );
    }
    this._value = this.format(value);
  }

  get value(): string {
    return this._value;
  }

  private format(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  private isValid(name: string): boolean {
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
  }

  equals(other: Name): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  getFirstName(): string {
    return this._value.split(' ')[0];
  }

  getLastName(): string {
    const parts = this._value.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }
}
