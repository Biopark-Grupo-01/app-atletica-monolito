import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@app/presentation/controllers/user.controller';
import { UserService } from '@app/application/services/user.service';
import { TypeOrmUserRepository } from '@infrastructure/typeorm/repositories/typeorm-user.repository';
import { HateoasService } from '@app/application/services/hateoas.service';
import { RoleModule } from './role.module';
import { User } from '@app/domain/entities/user.entity';
import { USER_REPOSITORY_TOKEN } from '@app/domain/repositories/user.repository.interface';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, NotificationModule],
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
