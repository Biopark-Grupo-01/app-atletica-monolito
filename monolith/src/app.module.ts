import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from '@infrastructure/config/config.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ProductModule } from './modules/product.module';
import { TrainingModule } from './modules/training.module';
import { EventModule } from './modules/event.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { RoleModule } from './modules/role.module';
import { MicroservicesModule } from './modules/microservices/microservices.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AppConfigModule,
    DatabaseModule,
    ProductModule,
    TrainingModule,
    EventModule,
    UserModule,
    RoleModule,
    MicroservicesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
