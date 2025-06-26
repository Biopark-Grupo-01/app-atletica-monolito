import {
  Injectable,
  Inject,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Role } from '@app/domain/entities/role.entity';
import {
  IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '@app/domain/repositories/role.repository.interface';
import {
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto,
} from '../dtos/role.dto';

@Injectable()
export class RoleService implements OnModuleInit {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @Inject(ROLE_REPOSITORY_TOKEN)
    private roleRepository: IRoleRepository,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding database...');
    await this.seedDefaultRoles();
    await this.seedAdminUser();
  }

  private async seedDefaultRoles() {
    const defaultRoles: CreateRoleDto[] = [
      {
        name: 'ADMIN',
        displayName: 'Líder da Atlética',
        isDefault: false,
      },
      {
        name: 'DIRECTOR',
        displayName: 'Diretoria',
        isDefault: false,
      },
      {
        name: 'ASSOCIATE',
        displayName: 'Associado',
        isDefault: false,
      },
      {
        name: 'NON_ASSOCIATE',
        displayName: 'Não Associado',
        isDefault: true, // This will be the default for new users
      },
    ];

    for (const roleData of defaultRoles) {
      const roleExists = await this.roleRepository.findByName(roleData.name);
      if (!roleExists) {
        this.logger.log(`Creating default role: ${roleData.displayName}`);
        await this.roleRepository.create(roleData);
      }
    }
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@biopark.com';
    const adminRoleName = 'ADMIN';

    // This is a simplified check. In a real app, you'd inject UserService.
    // For now, we assume if the role exists, the user might too.
    const adminRole = await this.roleRepository.findByName(adminRoleName);
    if (!adminRole) {
      this.logger.warn(
        `Admin role (${adminRoleName}) not found. Cannot seed admin user.`,
      );
      return;
    }

    // We can't directly check for user existence without UserService,
    // so we'll rely on the signup logic to handle existing users.
    this.logger.log(`Admin user seed check for: ${adminEmail}`);
  }

  private mapToResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      displayName: role.displayName,
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

  async findDefaultRole(): Promise<Role | null> {
    return this.roleRepository.findByName('NON_ASSOCIATE');
  }
}
