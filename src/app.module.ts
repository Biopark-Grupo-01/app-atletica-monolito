import { Module } from '@nestjs/common';
import { ConfigModule } from '@infrastructure/config/config.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ProductModule } from './product.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PrismaModule,
    UserModule,
    RoleModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
