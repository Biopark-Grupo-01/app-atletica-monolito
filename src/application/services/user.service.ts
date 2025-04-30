import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if the cargo exists
    const cargo = await this.prisma.cargo.findUnique({
      where: { id: createUserDto.cargoId },
    });

    if (!cargo) {
      throw new NotFoundException(
        `Cargo with ID ${createUserDto.cargoId} not found`,
      );
    }

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        registrationNumber: createUserDto.registrationNumber,
        cpf: createUserDto.cpf,
        email: createUserDto.email,
        password: createUserDto.password, // Consider encrypting the password
        phone: createUserDto.phone,
        cargo: {
          connect: { id: createUserDto.cargoId },
        },
      },
      include: {
        cargo: true,
      },
    });

    return this.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        cargo: true,
      },
    });
    return users.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        cargo: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.toResponseDto(user);
  }

  async update(
    id: string,
    updateData: Partial<CreateUserDto>,
  ): Promise<UserResponseDto> {
    // Handle cargo relationship if cargoId is provided
    const data: any = { ...updateData };

    if (updateData.cargoId) {
      // Check if the cargo exists
      const cargo = await this.prisma.cargo.findUnique({
        where: { id: updateData.cargoId },
      });

      if (!cargo) {
        throw new NotFoundException(
          `Cargo with ID ${updateData.cargoId} not found`,
        );
      }

      // Setup cargo relationship
      data.cargo = {
        connect: { id: updateData.cargoId },
      };
      delete data.cargoId;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
      include: {
        cargo: true,
      },
    });

    return this.toResponseDto(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private toResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      registrationNumber: user.registrationNumber,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      cargo: {
        id: user.cargo.id,
        name: user.cargo.name,
        description: user.cargo.description,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
