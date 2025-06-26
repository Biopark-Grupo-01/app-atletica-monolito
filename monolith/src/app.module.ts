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
import { TrainingUserModule } from './modules/training-user.module';
import { TrainingModalityModule } from './modules/training-modality.module';
import { MatchModule } from './modules/match.module';
import { UploadModule } from './modules/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    FirebaseModule,
    AppConfigModule,
    DatabaseModule,
    ProductModule,
    ProductCategoryModule,
    TrainingModule,
    TrainingUserModule,
    TrainingModalityModule,
    MatchModule,
    EventModule,
    UserModule,
    RoleModule,
    MicroservicesModule,
    AuthModule,
    NewsModule,
    NotificationModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
