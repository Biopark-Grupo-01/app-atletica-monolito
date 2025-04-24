import { Module } from '@nestjs/common';
import { ConfigModule } from '@infrastructure/config/config.module';
import { DatabaseModule } from '@infrastructure/database/database.module';

import { UserController } from './presentation/controllers/user.controller';
import { CargoController } from './presentation/controllers/cargo.controller';

import { UserService } from './application/services/user.service';
import { CargoService } from './application/services/cargo.service';

import { PrismaCargoRepository } from './infrastructure/repositories/prisma-cargo.repository';
import { CargoRepository } from './domain/repositories/cargo-repository';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [UserController, CargoController],
  providers: [
    UserService,
    CargoService,
    {
      provide: CargoRepository,
      useClass: PrismaCargoRepository,
    },
  ],
})
export class AppModule {}
