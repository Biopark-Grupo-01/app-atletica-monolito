export class CPF {
  private readonly _value: string;

  constructor(value: string) {
    const cleanCpf = this.clean(value);
    if (!this.isValid(cleanCpf)) {
      throw new Error('Invalid CPF format');
    }
    this._value = this.format(cleanCpf);
  }

  get value(): string {
    return this._value;
  }

  private clean(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private format(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private isValid(cpf: string): boolean {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
  }

  equals(other: CPF): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
