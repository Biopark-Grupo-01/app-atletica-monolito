import { v4 as uuidv4 } from 'uuid';
import { Cargo } from './cargo';

interface UserProps {
  name: string;
  registrationNumber: string;
  cpf: string;
  email: string;
  password: string;
  phone: string;
  cargo: Cargo;
}

export class User {
  private readonly id: string;
  private name: string;
  private registrationNumber: string;
  private cpf: string;
  private email: string;
  private password: string;
  private phone: string;
  private cargo: Cargo;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: UserProps) {
    this.id = uuidv4();
    this.name = props.name;
    this.registrationNumber = props.registrationNumber;
    this.cpf = props.cpf;
    this.email = props.email;
    this.password = props.password;
    this.phone = props.phone;
    this.cargo = props.cargo;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getRegistrationNumber(): string {
    return this.registrationNumber;
  }

  public getCpf(): string {
    return this.cpf;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getCargo(): Cargo {
    return this.cargo;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters with validations
  public setName(name: string): void {
    if (!name || name.trim().length < 3) {
      throw new Error('Name must have at least 3 characters');
    }
    this.name = name;
    this.updatedAt = new Date();
  }

  public setRegistrationNumber(registrationNumber: string): void {
    if (!registrationNumber || registrationNumber.trim() === '') {
      throw new Error('Registration number cannot be empty');
    }
    this.registrationNumber = registrationNumber;
    this.updatedAt = new Date();
  }

  public setCpf(cpf: string): void {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
    if (!cpf || !cpfRegex.test(cpf)) {
      throw new Error('Invalid CPF format');
    }
    this.cpf = cpf;
    this.updatedAt = new Date();
  }

  public setEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Invalid email');
    }
    this.email = email;
    this.updatedAt = new Date();
  }

  public setPassword(password: string): void {
    if (!password || password.length < 6) {
      throw new Error('Password must have at least 6 characters');
    }
    this.password = password;
    this.updatedAt = new Date();
  }

  public setPhone(phone: string): void {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}\-\d{4}$/;
    if (!phone || !phoneRegex.test(phone)) {
      throw new Error('Invalid phone format');
    }
    this.phone = phone;
    this.updatedAt = new Date();
  }

  public setCargo(cargo: Cargo): void {
    if (!cargo) {
      throw new Error('Cargo cannot be null');
    }
    this.cargo = cargo;
    this.updatedAt = new Date();
  }
}
