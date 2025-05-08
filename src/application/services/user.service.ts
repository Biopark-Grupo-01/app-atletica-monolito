import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { Cargo } from '../../domain/entities/cargo';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('CargoRepository')
    private readonly cargoRepository: any, // Use o tipo apropriado
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Buscar o cargo pelo ID
    const cargo = await this.cargoRepository.findOne(createUserDto.cargoId);
    if (!cargo) {
      throw new NotFoundException(
        `Cargo with ID ${createUserDto.cargoId} not found`,
      );
    }

    // Criar a entidade de usuário
    const cargoEntity = new Cargo({
      id: createUserDto.cargoId, // Usar o ID original do banco de dados
      name: cargo.getName(),
      description: cargo.getDescription(),
    });

    const user = new User({
      name: createUserDto.name,
      registrationNumber: createUserDto.registrationNumber,
      cpf: createUserDto.cpf,
      email: createUserDto.email,
      password: createUserDto.password, // Considerar criptografar a senha
      phone: createUserDto.phone,
      cargo: cargoEntity,
    });

    // Salvar o usuário
    const createdUser = await this.userRepository.create(user);

    return this.toResponseDto(createdUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return this.toResponseDto(user);
  }

  async update(
    id: string,
    updateData: Partial<CreateUserDto>,
  ): Promise<UserResponseDto | null> {
    // Buscar o usuário existente
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    // Atualizar campos básicos
    if (updateData.name) {
      existingUser.setName(updateData.name);
    }
    if (updateData.registrationNumber) {
      existingUser.setRegistrationNumber(updateData.registrationNumber);
    }
    if (updateData.cpf) {
      existingUser.setCpf(updateData.cpf);
    }
    if (updateData.email) {
      existingUser.setEmail(updateData.email);
    }
    if (updateData.password) {
      existingUser.setPassword(updateData.password);
    }
    if (updateData.phone) {
      existingUser.setPhone(updateData.phone);
    }

    // Atualizar cargo se necessário
    if (updateData.cargoId) {
      const newCargo = await this.cargoRepository.findOne(updateData.cargoId);
      if (!newCargo) {
        throw new NotFoundException(
          `Cargo with ID ${updateData.cargoId} not found`,
        );
      }

      const cargoEntity = new Cargo({
        id: updateData.cargoId, // Usar o ID original do banco de dados
        name: newCargo.getName(),
        description: newCargo.getDescription(),
      });

      existingUser.setCargo(cargoEntity);
    }

    // Salvar as alterações
    const updatedUser = await this.userRepository.update(existingUser);
    return this.toResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private toResponseDto(user: User): UserResponseDto {
    const cargo = user.getCargo();

    return {
      id: user.getId(),
      name: user.getName(),
      registrationNumber: user.getRegistrationNumber(),
      cpf: user.getCpf(),
      email: user.getEmail(),
      phone: user.getPhone(),
      cargo: {
        id: cargo.getId(),
        nome: cargo.getName(),
        descricao: cargo.getDescription(),
        createdAt: cargo.getCreatedAt(),
        updatedAt: cargo.getUpdatedAt(),
      },
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
