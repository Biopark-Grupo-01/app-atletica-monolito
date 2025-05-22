import { Role } from '../entities/role.entity';

export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string | null;
}

export const ROLE_REPOSITORY_TOKEN = Symbol('IRoleRepository');

export interface IRoleRepository {
  create(data: CreateRoleData): Promise<Role>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  update(id: string, data: UpdateRoleData): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
}
