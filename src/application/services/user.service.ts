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
} from '../../domain/repositories/user.repository.interface';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '../../domain/repositories/role.repository.interface';
import { User } from '../../domain/entities/user.entity';
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
    const roleDto: RoleResponseDto = user.role
      ? {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description ?? undefined,
          createdAt: user.role.createdAt,
          updatedAt: user.role.updatedAt,
        }
      : ({} as RoleResponseDto);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      registrationNumber: user.registrationNumber,
      cpf: user.cpf,
      phone: user.phone,
      role: roleDto,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      googleId: user.googleId,
      profilePictureUrl: user.profilePictureUrl,
      fcmToken: user.fcmToken,
    };
  }

  private mapArrayToResponseDto(users: User[]): UserResponseDto[] {
    return users.map((user) => this.mapToResponseDto(user));
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if (
      createUserDto.email &&
      (await this.userRepository.findByEmail(createUserDto.email))
    ) {
      throw new ConflictException('Email already in use.');
    }
    if (
      createUserDto.cpf &&
      createUserDto.cpf.length > 0 && // Ensure CPF is not empty string before check
      (await this.userRepository.findByCpf(createUserDto.cpf))
    ) {
      throw new ConflictException('CPF already in use.');
    }
    if (
      createUserDto.googleId &&
      (await this.userRepository.findByGoogleId(createUserDto.googleId))
    ) {
      throw new ConflictException('Google ID already in use.');
    }

    const role = await this.roleRepository.findById(createUserDto.roleId);
    if (!role) {
      throw new NotFoundException(
        `Role with ID '${createUserDto.roleId}' not found.`,
      );
    }

    const dtoToCreate = { ...createUserDto };

    if (dtoToCreate.password) {
      dtoToCreate.password = await this.hashPassword(dtoToCreate.password);
    } else if (!dtoToCreate.googleId) {
      // If not a Google Sign-In and no password, it's an issue
      throw new BadRequestException(
        'Password is required for non-Google sign-up.',
      );
    }
    // For Google Sign-In, password can be null/undefined

    try {
      const savedUser = await this.userRepository.create(dtoToCreate);
      return this.mapToResponseDto(savedUser);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to create user. ' +
          (error instanceof Error ? error.message : ''),
      );
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

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.mapToResponseDto(user) : null;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userToUpdate = await this.userRepository.findById(id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    const dtoToUpdate = { ...updateUserDto };

    if (dtoToUpdate.email && dtoToUpdate.email !== userToUpdate.email) {
      const existingUser = await this.userRepository.findByEmail(
        dtoToUpdate.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('New email already in use.');
      }
    }

    if (
      dtoToUpdate.googleId &&
      dtoToUpdate.googleId !== userToUpdate.googleId
    ) {
      const existingUser = await this.userRepository.findByGoogleId(
        dtoToUpdate.googleId,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('New Google ID already in use.');
      }
    }

    if (dtoToUpdate.password) {
      dtoToUpdate.password = await this.hashPassword(dtoToUpdate.password);
    } else {
      // Retain existing password if not provided in DTO
      delete dtoToUpdate.password;
    }

    const updatedUser = await this.userRepository.update(id, dtoToUpdate);
    if (!updatedUser) {
      throw new NotFoundException(
        `User with ID '${id}' could not be updated or was not found post-update.`,
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
