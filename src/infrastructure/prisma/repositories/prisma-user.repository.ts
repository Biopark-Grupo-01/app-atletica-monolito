import { Injectable } from '@nestjs/common';
import {
  User as PrismaUserModel,
  Role as PrismaRoleModel,
} from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import {
  IUserRepository,
  UpdateUserPersistenceData,
} from '../../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../prisma/prisma.service';

type PrismaUserWithRoleDetails = PrismaUserModel & { role: PrismaRoleModel };

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(prismaUser: PrismaUserWithRoleDetails): User | null {
    if (!prismaUser) return null;

    const domainRole = Role.fromPersistence(prismaUser.role);

    return User.fromPersistence({
      id: prismaUser.id,
      name: prismaUser.name,
      registrationNumber: prismaUser.registrationNumber,
      cpf: prismaUser.cpf,
      email: prismaUser.email,
      hashedPassword: prismaUser.password,
      phone: prismaUser.phone,
      role: domainRole,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  private mapArrayToDomain(prismaUsers: PrismaUserWithRoleDetails[]): User[] {
    return prismaUsers.map((pu) => this.mapToDomain(pu) as User);
  }

  async create(userDomainEntity: User): Promise<User> {
    const persistenceData = userDomainEntity.toPersistenceObject();
    const createdPrismaUser = await this.prisma.user.create({
      data: {
        id: persistenceData.id,
        name: persistenceData.name,
        registrationNumber: persistenceData.registrationNumber,
        cpf: persistenceData.cpf,
        email: persistenceData.email,
        password: persistenceData.password,
        phone: persistenceData.phone,
        roleId: persistenceData.roleId,
      },
      include: { role: true },
    });
    return this.mapToDomain(
      createdPrismaUser as PrismaUserWithRoleDetails,
    ) as User;
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    return prismaUser
      ? this.mapToDomain(prismaUser as PrismaUserWithRoleDetails)
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return prismaUser
      ? this.mapToDomain(prismaUser as PrismaUserWithRoleDetails)
      : null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { cpf },
      include: { role: true },
    });
    return prismaUser
      ? this.mapToDomain(prismaUser as PrismaUserWithRoleDetails)
      : null;
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      include: { role: true },
    });
    return this.mapArrayToDomain(prismaUsers as PrismaUserWithRoleDetails[]);
  }

  async update(
    id: string,
    data: UpdateUserPersistenceData,
  ): Promise<User | null> {
    try {
      const updatedPrismaUser = await this.prisma.user.update({
        where: { id },
        data: data,
        include: { role: true },
      });
      return this.mapToDomain(updatedPrismaUser as PrismaUserWithRoleDetails);
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      if (error.code === 'P2002') {
        throw new Error(`Unique constraint failed: ${error.meta?.target}`);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }
}
