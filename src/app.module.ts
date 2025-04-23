import { Module } from '@nestjs/common';
import { ConfigModule } from '@infrastructure/config/config.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { UserService } from './application/services/user.service';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
