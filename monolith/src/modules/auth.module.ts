import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '@app/presentation/controllers/auth.controller';
import { FirebaseAuthGuard } from '@app/infrastructure/guards/firebase-auth.guard';
import { FirebaseStrategy } from '@app/infrastructure/guards/firebase-auth.strategy';
import { UserModule } from './user.module';
import { HateoasService } from '@app/application/services/hateoas.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase' }),
    ConfigModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [HateoasService, FirebaseStrategy, FirebaseAuthGuard],
  exports: [PassportModule, FirebaseAuthGuard],
})
export class AuthModule {}
