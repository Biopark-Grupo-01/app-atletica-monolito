import { Module } from '@nestjs/common';
import { ConfigModule as AppConfigModule } from '@infrastructure/config/config.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ProductModule } from './modules/product.module';
import { ProductCategoryModule } from './modules/product-category.module';
import { TrainingModule } from './modules/training.module';
import { EventModule } from './modules/event.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { RoleModule } from './modules/role.module';
import { MicroservicesModule } from './modules/microservices/microservices.module';
import { AuthModule } from './modules/auth.module';
import { NewsModule } from './modules/news.module';
import { NotificationModule } from './modules/notification/notification.module';
import { FirebaseModule } from '@infrastructure/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    FirebaseModule,
    AppConfigModule,
    DatabaseModule,
    ProductModule,
    ProductCategoryModule,
    TrainingModule,
    EventModule,
    UserModule,
    RoleModule,
    MicroservicesModule,
    AuthModule,
    NewsModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
