import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from '../presentation/controllers/event.controller';
import { EventService } from '../application/services/event.service';
import { EVENT_REPOSITORY } from '../domain/repositories/event.repository.interface';
import { TypeOrmEventRepository } from '../infrastructure/typeorm/repositories/typeorm-event.repository';
import { Event } from '../domain/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: EVENT_REPOSITORY,
      useClass: TypeOrmEventRepository,
    },
  ],
  exports: [EventService],
})
export class EventModule {}