import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../../application/dtos/update-user.dto';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role) // Inject Role repository if needed for relations
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, ...userData } = createUserDto;
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new Error('Role not found'); // Or handle as per your app's error strategy
    }
    const newUser = this.userRepository.create({ ...userData, role });
    return this.userRepository.save(newUser);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { cpf }, relations: ['role'] });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { googleId },
      relations: ['role'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const { roleId, ...userData } = updateUserDto;
    let role: Role | null = null;
    if (roleId) {
      role = await this.roleRepository.findOneBy({ id: roleId });
      if (!role) {
        throw new Error('Role not found when updating user');
      }
    }

    const updatePayload: Partial<User> = { ...userData };
    if (role) {
      updatePayload.role = role;
    }

    await this.userRepository.update(id, updatePayload);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
