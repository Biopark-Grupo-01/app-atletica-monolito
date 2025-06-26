import { Module } from '@nestjs/common';
import { AuthController } from '@app/presentation/controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from '@infrastructure/guards/firebase-auth.strategy';
import { UserModule } from './user.module';
import { HateoasService } from '@app/application/services/hateoas.service';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [FirebaseAuthStrategy, HateoasService],
  exports: [],
})
export class AuthModule {}
