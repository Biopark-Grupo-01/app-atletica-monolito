import { v4 as uuidv4 } from 'uuid';

export class Cargo {
  private readonly id: string;
  private name: string;
  private description?: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: { id?: string; name: string; description?: string }) {
    this.id = props.id || uuidv4(); // Usar o ID fornecido ou gerar um novo
    this.name = props.name;
    this.description = props.description;
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

  public getDescription(): string | undefined {
    return this.description;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters with validations
  public setName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty');
    }
    this.name = name;
    this.updatedAt = new Date();
  }

  public setDescription(description?: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }
}
