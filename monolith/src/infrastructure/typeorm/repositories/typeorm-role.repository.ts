import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto, UpdateRoleDto } from '@app/application/dtos/role.dto';
import { IRoleRepository } from '@app/domain/repositories/role.repository.interface';
import { Role } from '@app/domain/entities/role.entity';

@Injectable()
export class TypeOrmRoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleRepository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOneBy({ name });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    const existingRole = await this.findById(id);
    if (!existingRole) {
      return null;
    }
    await this.roleRepository.update(id, updateRoleDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
