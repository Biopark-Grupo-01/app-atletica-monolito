import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '../../domain/repositories/role.repository.interface';
import { Role } from '../../domain/entities/role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { RoleResponseDto } from '../dtos/role-response.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  private mapToResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description ?? undefined,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  private mapArrayToResponseDto(roles: Role[]): RoleResponseDto[] {
    return roles.map((role) => this.mapToResponseDto(role));
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.findByName(
      createRoleDto.name,
    );
    if (existingRole) {
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists.`,
      );
    }

    const newRole = await this.roleRepository.create(createRoleDto);
    return this.mapToResponseDto(newRole);
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findAll();
    return this.mapArrayToResponseDto(roles);
  }

  async findOne(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found.`);
    }
    return this.mapToResponseDto(role);
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const roleToUpdate = await this.roleRepository.findById(id);
    if (!roleToUpdate) {
      throw new NotFoundException(`Role with ID '${id}' not found.`);
    }

    if (updateRoleDto.name && updateRoleDto.name !== roleToUpdate.name) {
      const existingRoleWithName = await this.roleRepository.findByName(
        updateRoleDto.name,
      );
      if (existingRoleWithName && existingRoleWithName.id !== id) {
        throw new ConflictException(
          `Role name '${updateRoleDto.name}' is already in use.`,
        );
      }
    }

    const dtoToUpdate: UpdateRoleDto = {};
    if (Object.prototype.hasOwnProperty.call(updateRoleDto, 'name'))
      dtoToUpdate.name = updateRoleDto.name;
    if (Object.prototype.hasOwnProperty.call(updateRoleDto, 'description'))
      dtoToUpdate.description = updateRoleDto.description;

    if (Object.keys(dtoToUpdate).length === 0) {
      return this.mapToResponseDto(roleToUpdate);
    }

    const updatedRole = await this.roleRepository.update(id, dtoToUpdate);
    if (!updatedRole) {
      throw new NotFoundException(
        `Role with ID '${id}' not found during update operation.`,
      );
    }
    return this.mapToResponseDto(updatedRole);
  }

  async delete(id: string): Promise<void> {
    const success = await this.roleRepository.delete(id);
    if (!success) {
      throw new BadRequestException(`Role with ID ${id} cold not be deleted.`);
    }
  }
}
