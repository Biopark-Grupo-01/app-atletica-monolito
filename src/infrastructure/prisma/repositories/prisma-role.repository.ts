import { Injectable } from '@nestjs/common';
import { Role as PrismaRoleModel } from '@prisma/client';
import { Role } from '../../../domain/entities/role.entity';
import {
  IRoleRepository,
  CreateRoleData,
  UpdateRoleData,
} from '../../../domain/repositories/role.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(prismaRole: PrismaRoleModel): Role | null {
    if (!prismaRole) return null;
    return Role.fromPersistence(prismaRole);
  }

  private mapArrayToDomain(prismaRoles: PrismaRoleModel[]): Role[] {
    return prismaRoles.map((pr) => Role.fromPersistence(pr));
  }

  async create(data: CreateRoleData): Promise<Role> {
    const prismaRole = await this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return this.mapToDomain(prismaRole) as Role;
  }

  async findAll(): Promise<Role[]> {
    const prismaRoles = await this.prisma.role.findMany();
    return this.mapArrayToDomain(prismaRoles);
  }

  async findById(id: string): Promise<Role | null> {
    const prismaRole = await this.prisma.role.findUnique({ where: { id } });
    return prismaRole ? this.mapToDomain(prismaRole) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const prismaRole = await this.prisma.role.findUnique({ where: { name } });
    return prismaRole ? this.mapToDomain(prismaRole) : null;
  }

  async update(id: string, data: UpdateRoleData): Promise<Role | null> {
    try {
      const updatedPrismaRole = await this.prisma.role.update({
        where: { id },
        data: {
          name: data.name,
          description: Object.prototype.hasOwnProperty.call(data, 'description')
            ? data.description
            : null,
        },
      });
      return this.mapToDomain(updatedPrismaRole);
    } catch (error) {
      // Prisma's P2025: "Record to update not found."
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.role.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        // "Record to delete not found."
        return false;
      }
      throw error;
    }
  }
}
