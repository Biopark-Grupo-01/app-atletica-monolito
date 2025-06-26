import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@app/application/dtos/user.dto';
import { RoleService } from './role.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@app/domain/entities/user.entity';
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from '@app/domain/repositories/user.repository.interface';
import { RoleResponseDto } from '../dtos/role.dto';
import { NotificationService } from '../../modules/notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private userRepository: IUserRepository,
    private roleService: RoleService,
    private notificationService: NotificationService,
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

  async findByFirebaseUid(
    firebaseUid: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByFirebaseUid(firebaseUid);
    if (!user) {
      return null;
    }
    return this.mapToResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUserByEmail = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException(
        `O e-mail ${createUserDto.email} já está em uso.`,
      );
    }

    if (createUserDto.firebaseUid) {
      const existingUserByFirebaseUid =
        await this.userRepository.findByFirebaseUid(createUserDto.firebaseUid);
      if (existingUserByFirebaseUid) {
        throw new ConflictException(
          `Usuário com este UID do Firebase já existe.`,
        );
      }
    }

    // Find the default role for new users
    const defaultRole = await this.roleService.findDefaultRole();
    if (!defaultRole) {
      throw new Error(
        'Default role not found. Database seeding may have failed.',
      );
    }

    const newUser = await this.userRepository.create({
      id: uuidv4(),
      ...createUserDto,
      roleId: defaultRole.id, // Assign the default role
    } as User);

    if (newUser.fcmToken) {
      this.notificationService.sendNotification(
        newUser.fcmToken,
        'Bem-vindo à Atlética!',
        'Seu cadastro foi realizado com sucesso!',
      );
    }

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
