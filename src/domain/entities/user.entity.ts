import { v4 as uuidv4 } from 'uuid';
import { Role } from './role.entity';

export interface UserCreateProps {
  name: string;
  registrationNumber: string;
  cpf: string;
  email: string;
  passwordToHash: string;
  phone: string;
  role: Role;
}

interface UserInternalProps {
  id: string;
  name: string;
  registrationNumber: string;
  cpf: string;
  email: string;
  hashedPassword: string;
  phone: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  public readonly id: string;
  private _name: string;
  private _registrationNumber: string;
  private _cpf: string;
  private _email: string;
  private _hashedPassword: string;
  private _phone: string;
  private _role: Role;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserInternalProps) {
    this.id = props.id;
    this._name = props.name;
    this._registrationNumber = props.registrationNumber;
    this._cpf = props.cpf;
    this._email = props.email;
    this._hashedPassword = props.hashedPassword;
    this._phone = props.phone;
    this._role = props.role;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length < 3) {
      throw new Error('Name must have at least 3 characters.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this._email || !emailRegex.test(this._email)) {
      throw new Error('Invalid email format.');
    }
    if (!this._hashedPassword) {
      throw new Error('Hashed password cannot be empty.');
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!this._cpf || !cpfRegex.test(this._cpf)) {
      throw new Error('Invalid CPF format. Expected: XXX.XXX.XXX-XX');
    }
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!this._phone || !phoneRegex.test(this._phone)) {
      throw new Error(
        'Invalid phone format. Expected: (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
      );
    }
    if (!this._registrationNumber || this._registrationNumber.trim() === '') {
      throw new Error('Registration number cannot be empty.');
    }
    if (!this._role) {
      throw new Error('User must have a role.');
    }
  }

  public static create(props: UserCreateProps, hashedPassword: string): User {
    if (!props.name || props.name.trim().length < 3)
      throw new Error('Name must have at least 3 characters for new user.');

    const now = new Date();
    return new User({
      id: uuidv4(),
      name: props.name,
      registrationNumber: props.registrationNumber,
      cpf: props.cpf,
      email: props.email,
      hashedPassword: hashedPassword,
      phone: props.phone,
      role: props.role,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static fromPersistence(data: {
    id: string;
    name: string;
    registrationNumber: string;
    cpf: string;
    email: string;
    hashedPassword: string;
    phone: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({ ...data });
  }

  get name(): string {
    return this._name;
  }
  get registrationNumber(): string {
    return this._registrationNumber;
  }
  get cpf(): string {
    return this._cpf;
  }
  get email(): string {
    return this._email;
  }
  get hashedPassword(): string {
    return this._hashedPassword;
  }
  get phone(): string {
    return this._phone;
  }
  get role(): Role {
    return this._role;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }

  public setName(name: string): void {
    if (!name || name.trim().length < 3)
      throw new Error('Name must have at least 3 characters.');
    this._name = name;
    this._updatedAt = new Date();
  }

  public setEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) throw new Error('Invalid email.');
    this._email = email;
    this._updatedAt = new Date();
  }

  public changePassword(newHashedPassword: string): void {
    if (!newHashedPassword)
      throw new Error('New hashed password cannot be empty.');
    this._hashedPassword = newHashedPassword;
    this._updatedAt = new Date();
  }

  public setPhone(phone: string): void {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phone || !phoneRegex.test(phone)) {
      throw new Error('Invalid phone format.');
    }
    this._phone = phone;
    this._updatedAt = new Date();
  }

  public setRole(role: Role): void {
    if (!role) throw new Error('Role cannot be null.');
    this._role = role;
    this._updatedAt = new Date();
  }

  public setRegistrationNumber(registrationNumber: string): void {
    if (!registrationNumber || registrationNumber.trim() === '') {
      throw new Error('Registration number cannot be empty.');
    }
    this._registrationNumber = registrationNumber;
    this._updatedAt = new Date();
  }

  public setCpf(cpf: string): void {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpf || !cpfRegex.test(cpf)) {
      throw new Error('Invalid CPF format.');
    }
    this._cpf = cpf;
    this._updatedAt = new Date();
  }

  public toPersistenceObject(): {
    id: string;
    name: string;
    registrationNumber: string;
    cpf: string;
    email: string;
    password: string;
    phone: string;
    roleId: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      name: this._name,
      registrationNumber: this._registrationNumber,
      cpf: this._cpf,
      email: this._email,
      password: this._hashedPassword,
      phone: this._phone,
      roleId: this._role.id,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
