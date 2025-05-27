import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from '@infrastructure/config/config.module'; // Aliased to avoid conflict
import { DatabaseModule } from '@infrastructure/database/database.module';
import { UserModule } from './modules/user.module';
import { RoleModule } from './modules/role.module';
import { ProductModule } from './modules/product.module';
import { ConfigModule } from '@nestjs/config'; // For .env loading

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AppConfigModule,
    DatabaseModule,
    UserModule,
    RoleModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
