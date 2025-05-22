import { Module } from '@nestjs/common';
import { RoleController } from '../presentation/controllers/role.controller';
import { RoleService } from '../application/services/role.service';
import { PrismaRoleRepository } from '../infrastructure/prisma/repositories/prisma-role.repository';
import { ROLE_REPOSITORY_TOKEN } from '../domain/repositories/role.repository.interface';

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: PrismaRoleRepository,
    },
  ],
  exports: [RoleService, ROLE_REPOSITORY_TOKEN],
})
export class RoleModule {}
