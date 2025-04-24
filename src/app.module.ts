import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { CargoController } from './presentation/controllers/cargo.controller';
import { CargoService } from './application/services/cargo.service';
import { PrismaCargoRepository } from './infrastructure/repositories/prisma-cargo.repository';

@Module({
  imports: [],
  controllers: [AppController, UserController, CargoController],
  providers: [
    AppService,
    UserService,
    CargoService,
    {
      provide: 'CargoRepository',
      useClass: PrismaCargoRepository,
    },
  ],
})
export class AppModule {}
