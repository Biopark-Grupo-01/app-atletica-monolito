import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from '../presentation/controllers/role.controller';
import { RoleService } from '../application/services/role.service';
import { TypeOrmRoleRepository } from '../infrastructure/typeorm/repositories/typeorm-role.repository';
import { ROLE_REPOSITORY_TOKEN } from '../domain/repositories/role.repository.interface';
import { Role } from '../domain/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: TypeOrmRoleRepository,
    },
  ],
  exports: [RoleService, ROLE_REPOSITORY_TOKEN],
})
export class RoleModule {}
