export class Address {
  private readonly _street: string;
  private readonly _number: string;
  private readonly _neighborhood: string;
  private readonly _city: string;
  private readonly _state: string;
  private readonly _zipCode: string;
  private readonly _country: string;

  constructor(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
    country: string = 'Brasil',
  ) {
    this.validateInputs(street, city, state, zipCode);

    this._street = street.trim();
    this._number = number.trim();
    this._neighborhood = neighborhood.trim();
    this._city = city.trim();
    this._state = state.trim().toUpperCase();
    this._zipCode = this.formatZipCode(zipCode);
    this._country = country.trim();
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get country(): string {
    return this._country;
  }

  get fullAddress(): string {
    return `${this._street}, ${this._number} - ${this._neighborhood}, ${this._city} - ${this._state}, ${this._zipCode}, ${this._country}`;
  }

  private validateInputs(
    street: string,
    city: string,
    state: string,
    zipCode: string,
  ): void {
    if (!street || street.trim().length === 0) {
      throw new Error('Street cannot be empty');
    }
    if (!city || city.trim().length === 0) {
      throw new Error('City cannot be empty');
    }
    if (!state || state.trim().length === 0) {
      throw new Error('State cannot be empty');
    }
    if (!this.isValidZipCode(zipCode)) {
      throw new Error('Invalid zip code format');
    }
  }

  private isValidZipCode(zipCode: string): boolean {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    return cleanZipCode.length === 8;
  }

  private formatZipCode(zipCode: string): string {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    return cleanZipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  equals(other: Address): boolean {
    return (
      this._street === other._street &&
      this._number === other._number &&
      this._neighborhood === other._neighborhood &&
      this._city === other._city &&
      this._state === other._state &&
      this._zipCode === other._zipCode &&
      this._country === other._country
    );
  }

  toString(): string {
    return this.fullAddress;
  }
}
