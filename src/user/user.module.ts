import { Module } from '@nestjs/common';
import { UserController } from '../presentation/controllers/user.controller';
import { UserService } from '../application/services/user.service';
import { PrismaUserRepository } from '../infrastructure/prisma/repositories/prisma-user.repository';
import { USER_REPOSITORY_TOKEN } from '../domain/repositories/user.repository.interface';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY_TOKEN],
})
export class UserModule {}
