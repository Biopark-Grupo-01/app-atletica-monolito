import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@app/application/dtos/user.dto';
import { RoleService } from './role.service'; // Assuming RoleService exists and can provide RoleResponseDto
import { v4 as uuidv4 } from 'uuid';
import { User } from '@app/domain/entities/user.entity';
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from '@app/domain/repositories/user.repository.interface';
import { RoleResponseDto } from '../dtos/role.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private userRepository: IUserRepository,
    private roleService: RoleService, // Inject RoleService
  ) {}

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  private async mapToResponseDto(user: User): Promise<UserResponseDto> {
    let roleDto: RoleResponseDto | undefined = undefined;
    if (user.roleId) {
      try {
        roleDto = await this.roleService.findById(user.roleId);
      } catch (error) {
        console.error(
          `Error fetching role with ID ${user.roleId} for user ${user.id}:`,
          error,
        );
      }
    }
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      firebaseUid: user.firebaseUid,
      fcmToken: user.fcmToken,
      role: roleDto,
      planStartDate: user.planStartDate,
      planEndDate: user.planEndDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async mapArrayToResponseDto(
    users: User[],
  ): Promise<UserResponseDto[]> {
    return Promise.all(users.map((u) => this.mapToResponseDto(u)));
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return this.mapArrayToResponseDto(users);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByFirebaseUid(firebaseUid);
    if (!user) {
      throw new NotFoundException(
        `User with Firebase UID ${firebaseUid} not found`,
      );
    }
    return this.mapToResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const newUser = await this.userRepository.create({
      id: uuidv4(),
      ...createUserDto,
    } as User);
    return this.mapToResponseDto(newUser);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found for update`);
    }
    return this.mapToResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new NotFoundException(`User with ID ${id} not found for deletion`);
    }
  }
}
