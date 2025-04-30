import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { Cargo } from '../../domain/entities/cargo';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: User): Promise<User> {
    const userData = {
      name: user.getName(),
      registrationNumber: user.getRegistrationNumber(),
      cpf: user.getCpf(),
      email: user.getEmail(),
      password: user.getPassword(), // Considerar criptografar a senha
      phone: user.getPhone(),
      cargoId: user.getCargo().getId(),
    };

    const created = await this.prisma.user.create({
      data: userData,
      include: {
        cargo: true,
      },
    });

    const cargo = new Cargo({
      name: created.cargo.name,
      description: created.cargo.description || undefined,
    });

    return new User({
      name: created.name,
      registrationNumber: created.registrationNumber,
      cpf: created.cpf,
      email: created.email,
      password: created.password,
      phone: created.phone,
      cargo: cargo,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        cargo: true,
      },
    });

    if (!user) {
      return null;
    }

    const cargo = new Cargo({
      name: user.cargo.name,
      description: user.cargo.description || undefined,
    });

    return new User({
      name: user.name,
      registrationNumber: user.registrationNumber,
      cpf: user.cpf,
      email: user.email,
      password: user.password,
      phone: user.phone,
      cargo: cargo,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        cargo: true,
      },
    });

    if (!user) {
      return null;
    }

    const cargo = new Cargo({
      name: user.cargo.name,
      description: user.cargo.description || undefined,
    });

    return new User({
      name: user.name,
      registrationNumber: user.registrationNumber,
      cpf: user.cpf,
      email: user.email,
      password: user.password,
      phone: user.phone,
      cargo: cargo,
    });
  }

  async update(user: User): Promise<User> {
    const userData = {
      name: user.getName(),
      registrationNumber: user.getRegistrationNumber(),
      cpf: user.getCpf(),
      email: user.getEmail(),
      password: user.getPassword(),
      phone: user.getPhone(),
      cargoId: user.getCargo().getId(),
    };

    const updated = await this.prisma.user.update({
      where: { id: user.getId() },
      data: userData,
      include: {
        cargo: true,
      },
    });

    const cargo = new Cargo({
      name: updated.cargo.name,
      description: updated.cargo.description || undefined,
    });

    return new User({
      name: updated.name,
      registrationNumber: updated.registrationNumber,
      cpf: updated.cpf,
      email: updated.email,
      password: updated.password,
      phone: updated.phone,
      cargo: cargo,
    });
  }

  async delete(id: string): Promise<User> {
    const deleted = await this.prisma.user.delete({
      where: { id },
      include: {
        cargo: true,
      },
    });

    const cargo = new Cargo({
      name: deleted.cargo.name,
      description: deleted.cargo.description || undefined,
    });

    return new User({
      name: deleted.name,
      registrationNumber: deleted.registrationNumber,
      cpf: deleted.cpf,
      email: deleted.email,
      password: deleted.password,
      phone: deleted.phone,
      cargo: cargo,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        cargo: true,
      },
    });

    return users.map((user) => {
      const cargo = new Cargo({
        name: user.cargo.name,
        description: user.cargo.description || undefined,
      });

      return new User({
        name: user.name,
        registrationNumber: user.registrationNumber,
        cpf: user.cpf,
        email: user.email,
        password: user.password,
        phone: user.phone,
        cargo: cargo,
      });
    });
  }
}
