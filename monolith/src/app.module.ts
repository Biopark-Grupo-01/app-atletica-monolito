import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from '@infrastructure/config/config.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { UserModule } from './modules/user.module';
import { RoleModule } from './modules/role.module';
import { TrainingModalityModule } from './modules/training-modality.module';
import { ProductModule } from './modules/product.module';
import { TrainingModule } from './modules/training.module';
import { EventModule } from './modules/event.module';
import { ConfigModule } from '@nestjs/config';
import { MicroservicesModule } from './modules/microservices/microservices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AppConfigModule,
    DatabaseModule,
    UserModule,
    RoleModule,
    TrainingModalityModule,
    ProductModule,
    TrainingModule,
    EventModule,
    MicroservicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
