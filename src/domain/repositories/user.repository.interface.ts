import { User } from '../entities/user.entity';
import { CreateUserDto } from '../../application/dtos/create-user.dto'; // Assuming DTOs are used for creation
import { UpdateUserDto } from '../../application/dtos/update-user.dto'; // Assuming DTOs are used for updates

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>; // Changed to use DTO
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>; // Keep if still relevant
  findByGoogleId(googleId: string): Promise<User | null>; // New method for Google Sign-In
  findAll(): Promise<User[]>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>; // Changed to use DTO
  delete(id: string): Promise<boolean>;
  // remove(id: string): Promise<void>; // Alternative delete signature often used with TypeORM
}
