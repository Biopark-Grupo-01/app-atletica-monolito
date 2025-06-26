import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../../application/dtos/role.dto';

export const ROLE_REPOSITORY_TOKEN = Symbol('IRoleRepository');

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  create(createRoleDto: CreateRoleDto): Promise<Role>;
  update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
}
