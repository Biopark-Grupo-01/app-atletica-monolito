export class Phone {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid phone format');
    }
    this._value = this.format(value);
  }

  get value(): string {
    return this._value;
  }

  private clean(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  private format(phone: string): string {
    const clean = this.clean(phone);
    // Format: +55 (XX) XXXXX-XXXX
    if (clean.length === 11) {
      return `+55 (${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
    }
    // Format: +55 (XX) XXXX-XXXX
    if (clean.length === 10) {
      return `+55 (${clean.substring(0, 2)}) ${clean.substring(2, 6)}-${clean.substring(6)}`;
    }
    return this._value;
  }

  private isValid(phone: string): boolean {
    const clean = this.clean(phone);
    // Brazilian phone: 10 or 11 digits
    return clean.length === 10 || clean.length === 11;
  }

  equals(other: Phone): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
