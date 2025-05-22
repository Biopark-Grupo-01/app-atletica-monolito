import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
  UpdateUserPersistenceData,
} from '../../domain/repositories/user.repository.interface';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '../../domain/repositories/role.repository.interface';
import { User, UserCreateProps } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { RoleResponseDto } from '../dtos/role-response.dto';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private mapToResponseDto(user: User): UserResponseDto {
    const roleDto: RoleResponseDto = {
      id: user.role.id,
      name: user.role.name,
      description: user.role.description ?? undefined,
      createdAt: user.role.getCreatedAt(),
      updatedAt: user.role.updatedAt,
    };
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      registrationNumber: user.registrationNumber,
      cpf: user.cpf,
      phone: user.phone,
      role: roleDto,
      createdAt: user.getCreatedAt(),
      updatedAt: user.updatedAt,
    };
  }

  private mapArrayToResponseDto(users: User[]): UserResponseDto[] {
    return users.map((user) => this.mapToResponseDto(user));
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if (await this.userRepository.findByEmail(createUserDto.email)) {
      throw new ConflictException('Email already in use.');
    }
    if (await this.userRepository.findByCpf(createUserDto.cpf)) {
      throw new ConflictException('CPF already in use.');
    }

    const role = await this.roleRepository.findById(createUserDto.roleId);
    if (!role) {
      throw new NotFoundException(
        `Role with ID '${createUserDto.roleId}' not found.`,
      );
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    try {
      const userCreateProps: UserCreateProps = {
        name: createUserDto.name,
        registrationNumber: createUserDto.registrationNumber,
        cpf: createUserDto.cpf,
        email: createUserDto.email,
        passwordToHash: createUserDto.password, // Pass raw password, entity takes hashed
        phone: createUserDto.phone,
        role: role,
      };
      // User.create will validate properties and generate ID
      const userDomainEntity = User.create(userCreateProps, hashedPassword);

      const savedUser = await this.userRepository.create(userDomainEntity);
      return this.mapToResponseDto(savedUser);
    } catch (error) {
      // Catch validation errors from User.create or other issues
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to create user.');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return this.mapArrayToResponseDto(users);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }
    return this.mapToResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userToUpdate = await this.userRepository.findById(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    const dataToPersist: UpdateUserPersistenceData = {};

    if (updateUserDto.name) dataToPersist.name = updateUserDto.name;
    if (updateUserDto.registrationNumber)
      dataToPersist.registrationNumber = updateUserDto.registrationNumber;
    if (updateUserDto.phone) dataToPersist.phone = updateUserDto.phone;

    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      if (await this.userRepository.findByEmail(updateUserDto.email)) {
        throw new ConflictException('New email already in use.');
      }
      dataToPersist.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      dataToPersist.password = await this.hashPassword(updateUserDto.password);
    }

    if (updateUserDto.roleId && updateUserDto.roleId !== userToUpdate.role.id) {
      const newRole = await this.roleRepository.findById(updateUserDto.roleId);
      if (!newRole) {
        throw new NotFoundException(
          `New Role with ID '${updateUserDto.roleId}' not found.`,
        );
      }
      dataToPersist.roleId = newRole.id;
    }

    if (Object.keys(dataToPersist).length === 0) {
      // Potentially return current user state or throw BadRequest
      // throw new BadRequestException('No update data provided.');
      return this.mapToResponseDto(userToUpdate); // Or simply return existing if no changes
    }

    // Domain entity setters can be called here if you want to run domain validations before persistence call,
    // but since persistence data is partial, it's simpler to pass to repository.
    // userToUpdate.setName(updateUserDto.name); // etc. then user.toPersistenceObject()
    // But this requires fetching the full User entity again after update for the response.

    const updatedUser = await this.userRepository.update(id, dataToPersist);
    if (!updatedUser) {
      throw new NotFoundException(
        `User with ID '${id}' could not be updated or was not found during update.`,
      );
    }
    return this.mapToResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new NotFoundException(
        `User with ID '${id}' not found for deletion.`,
      );
    }
  }
}
