import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Cargo } from '../../domain/entities/cargo';
import { CargoRepository } from '../../domain/repositories/cargo-repository';

@Injectable()
export class PrismaCargoRepository implements CargoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(cargo: { name: string; description?: string }): Promise<Cargo> {
    const created = await this.prisma.cargo.create({
      data: {
        nome: cargo.name,
        descricao: cargo.description,
      },
    });

    return new Cargo({
      name: created.nome,
      description: created.descricao || undefined,
    });
  }

  async findAll(): Promise<Cargo[]> {
    const cargos = await this.prisma.cargo.findMany();
    return cargos.map(
      (cargo) =>
        new Cargo({
          name: cargo.nome,
          description: cargo.descricao || undefined,
        }),
    );
  }

  async findOne(id: string): Promise<Cargo | null> {
    const cargo = await this.prisma.cargo.findUnique({
      where: { id },
    });

    if (!cargo) {
      return null;
    }

    return new Cargo({
      name: cargo.nome,
      description: cargo.descricao || undefined,
    });
  }

  async update(
    id: string,
    cargo: Partial<{ name: string; description?: string }>,
  ): Promise<Cargo> {
    const updated = await this.prisma.cargo.update({
      where: { id },
      data: {
        nome: cargo.name,
        descricao: cargo.description,
      },
    });

    return new Cargo({
      name: updated.nome,
      description: updated.descricao || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cargo.delete({
      where: { id },
    });
  }
}
