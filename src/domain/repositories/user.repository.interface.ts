import { User } from '../entities/user.entity';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
