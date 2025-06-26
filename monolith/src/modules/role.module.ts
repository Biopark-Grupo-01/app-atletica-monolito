import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from '@app/presentation/controllers/role.controller';
import { RoleService } from '@app/application/services/role.service';
import { TypeOrmRoleRepository } from '@infrastructure/typeorm/repositories/typeorm-role.repository';
import { HateoasService } from '@app/application/services/hateoas.service';
import { ROLE_REPOSITORY_TOKEN } from '@app/domain/repositories/role.repository.interface';
import { Role } from '@app/domain/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [
    RoleService,
    HateoasService,
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: TypeOrmRoleRepository,
    },
  ],
  exports: [RoleService, ROLE_REPOSITORY_TOKEN],
})
export class RoleModule {}
