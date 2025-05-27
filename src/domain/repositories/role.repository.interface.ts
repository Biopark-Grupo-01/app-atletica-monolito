import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { UpdateRoleDto } from '../../application/dtos/update-role.dto';

export const ROLE_REPOSITORY_TOKEN = Symbol('IRoleRepository');

export interface IRoleRepository {
  create(createRoleDto: CreateRoleDto): Promise<Role>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
  // remove(id: string): Promise<void>; // Alternative delete signature
}
