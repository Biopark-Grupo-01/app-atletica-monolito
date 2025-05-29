import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../../domain/entities/role.entity';
import { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import { CreateRoleDto } from '../../../application/dtos/create-role.dto';
import { UpdateRoleDto } from '../../../application/dtos/update-role.dto';

@Injectable()
export class TypeOrmRoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOneBy({ name });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
