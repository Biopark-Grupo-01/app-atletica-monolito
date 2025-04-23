import { v4 as uuidv4 } from 'uuid';

interface UserProps {
    name: string;
    email: string;
    password: string;
}
  
export class User {
    private readonly id: string;
    private name: string;
    private email: string;
    private password: string;
    private readonly createdAt: Date;
    private updatedAt: Date;
  
    constructor(props: UserProps) {
      this.id = uuidv4();
      this.name = props.name;
      this.email = props.email;
      this.password = props.password;
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
  
    public getEmail(): string {
      return this.email;
    }
  
    public getCreatedAt(): Date {
      return this.createdAt;
    }
  
    public getUpdatedAt(): Date {
      return this.updatedAt;
    }
  
    // Setters com validações
    public setName(name: string): void {
      if (!name || name.trim().length < 3) {
        throw new Error('Nome deve ter pelo menos 3 caracteres');
      }
      this.name = name;
      this.updatedAt = new Date();
    }
  
    public setEmail(email: string): void {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error('Email inválido');
      }
      this.email = email;
      this.updatedAt = new Date();
    }
  }