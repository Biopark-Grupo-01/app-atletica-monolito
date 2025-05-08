import { Injectable } from '@nestjs/common';
import { Cargo } from '../../domain/entities/cargo';
import { CargoRepository } from '../../domain/repositories/cargo-repository';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaCargoRepository implements CargoRepository {
  constructor(private prisma: PrismaService) {}

  async create(cargo: { name: string; description?: string }): Promise<Cargo> {
    const created = await this.prisma.cargo.create({
      data: {
        name: cargo.name,
        description: cargo.description,
      },
    });

    return new Cargo({
      id: created.id, // Adicionando o ID ao criar a entidade Cargo
      name: created.name,
      description: created.description || undefined,
    });
  }

  async findAll(): Promise<Cargo[]> {
    const cargos = await this.prisma.cargo.findMany();
    return cargos.map(
      (cargo) =>
        new Cargo({
          id: cargo.id, // Adicionando o ID ao criar a entidade Cargo
          name: cargo.name,
          description: cargo.description || undefined,
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
      id: cargo.id, // Adicionando o ID ao criar a entidade Cargo
      name: cargo.name,
      description: cargo.description || undefined,
    });
  }

  async update(
    id: string,
    cargo: Partial<{ name: string; description?: string }>,
  ): Promise<Cargo> {
    const updated = await this.prisma.cargo.update({
      where: { id },
      data: {
        name: cargo.name,
        description: cargo.description,
      },
    });

    return new Cargo({
      id: updated.id, // Adicionando o ID ao criar a entidade Cargo
      name: updated.name,
      description: updated.description || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cargo.delete({
      where: { id },
    });
  }
}
