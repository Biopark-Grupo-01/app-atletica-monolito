import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from '@app/presentation/controllers/event.controller';
import { EventService } from '../application/services/event.service';
import { EVENT_REPOSITORY } from '../domain/repositories/event.repository.interface';
import { TypeOrmEventRepository } from '../infrastructure/typeorm/repositories/typeorm-event.repository';
import { Event } from '../domain/entities/event.entity';
import { HateoasService } from '../application/services/hateoas.service';
import { UserModule } from './user.module';
import { NotificationModule } from './notification/notification.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    UserModule,
    NotificationModule,
    GatewayModule,
  ],
  controllers: [EventController],
  providers: [
    EventService,
    HateoasService,
    {
      provide: EVENT_REPOSITORY,
      useClass: TypeOrmEventRepository,
    },
  ],
  exports: [EventService],
})
export class EventModule {}
