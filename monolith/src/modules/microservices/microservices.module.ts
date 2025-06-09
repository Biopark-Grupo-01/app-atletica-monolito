import { Module } from '@nestjs/common';
import { MicroservicesController } from './controllers/microservices.controller';
import { EventModule } from '../event.module';
import { UserModule } from '../user.module';

@Module({
  imports: [EventModule, UserModule],
  controllers: [MicroservicesController],
})
export class MicroservicesModule {}
