import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto,
} from '@app/application/dtos/role.dto';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '@app/domain/repositories/role.repository.interface';
import { Role } from '@app/domain/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private roleRepository: IRoleRepository,
  ) {}

  private mapToResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  private mapArrayToResponseDto(roles: Role[]): RoleResponseDto[] {
    return roles.map((r) => this.mapToResponseDto(r));
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findAll();
    return this.mapArrayToResponseDto(roles);
  }

  async findById(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return this.mapToResponseDto(role);
  }

  async findByName(name: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return this.mapToResponseDto(role);
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const newRole = await this.roleRepository.create(createRoleDto);
    return this.mapToResponseDto(newRole);
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const updatedRole = await this.roleRepository.update(id, updateRoleDto);
    if (!updatedRole) {
      throw new NotFoundException(`Role with ID ${id} not found for update`);
    }
    return this.mapToResponseDto(updatedRole);
  }

  async delete(id: string): Promise<void> {
    const success = await this.roleRepository.delete(id);
    if (!success) {
      throw new NotFoundException(`Role with ID ${id} not found for deletion`);
    }
  }
}
