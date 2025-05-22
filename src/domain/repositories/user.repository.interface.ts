import { User } from '../entities/user.entity';

export interface UpdateUserPersistenceData {
  name?: string;
  registrationNumber?: string;
  email?: string;
  password?: string;
  phone?: string;
  roleId?: string;
}

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserPersistenceData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
