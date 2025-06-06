import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../presentation/controllers/user.controller';
import { UserService } from '../application/services/user.service';
import { TypeOrmUserRepository } from '../infrastructure/typeorm/repositories/typeorm-user.repository';
import { USER_REPOSITORY_TOKEN } from '../domain/repositories/user.repository.interface';
import { RoleModule } from './role.module';
import { User } from '../domain/entities/user.entity';
import { Role } from '../domain/entities/role.entity';
import { HateoasService } from '../application/services/hateoas.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    HateoasService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY_TOKEN],
})
export class UserModule {}
