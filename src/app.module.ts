import { Module } from '@nestjs/common';
import { ConfigModule } from '@infrastructure/config/config.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [ConfigModule, DatabaseModule, PrismaModule, UserModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
