import { v4 as uuidv4 } from 'uuid';

export interface RoleProps {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RoleConstructorProps {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Role {
  public readonly id: string;
  private _name: string;
  private _description: string | null;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: RoleConstructorProps) {
    this.id = props.id;
    this._name = props.name;
    this._description = props.description;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim() === '') {
      throw new Error('Role name cannot be empty.');
    }
  }

  public static create(props: { name: string; description?: string }): Role {
    if (!props.name || props.name.trim() === '') {
      throw new Error('Name cannot be empty when creating a new Role.');
    }
    const now = new Date();
    return new Role({
      id: uuidv4(),
      name: props.name,
      description: props.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static fromPersistence(data: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Role {
    return new Role({
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }

  public setName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Role name cannot be empty.');
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  public setDescription(description: string | null): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  public toPersistenceObject(): {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      name: this._name,
      description: this._description ?? null,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
