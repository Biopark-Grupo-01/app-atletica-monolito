import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { Cargo } from '../../domain/entities/cargo';
import { CargoRepository } from '../../domain/repositories/cargo-repository';

@Injectable()
export class PrismaCargoRepository implements CargoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(
    cargo: Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Cargo> {
    const created = await this.prisma.cargo.create({
      data: cargo,
    });

    return new Cargo(
      created.id,
      created.nome,
      created.descricao,
      created.createdAt,
      created.updatedAt,
    );
  }

  async findAll(): Promise<Cargo[]> {
    const cargos = await this.prisma.cargo.findMany();
    return cargos.map(
      (cargo) =>
        new Cargo(
          cargo.id,
          cargo.nome,
          cargo.descricao,
          cargo.createdAt,
          cargo.updatedAt,
        ),
    );
  }

  async findOne(id: string): Promise<Cargo | null> {
    const cargo = await this.prisma.cargo.findUnique({
      where: { id },
    });

    if (!cargo) {
      return null;
    }

    return new Cargo(
      cargo.id,
      cargo.nome,
      cargo.descricao,
      cargo.createdAt,
      cargo.updatedAt,
    );
  }

  async update(
    id: string,
    cargo: Partial<Omit<Cargo, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Cargo> {
    const updated = await this.prisma.cargo.update({
      where: { id },
      data: cargo,
    });

    return new Cargo(
      updated.id,
      updated.nome,
      updated.descricao,
      updated.createdAt,
      updated.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cargo.delete({
      where: { id },
    });
  }
}
