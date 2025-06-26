import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { Ticket } from '../domain/entities/ticket.entity';
import { TicketService } from '../application/services/ticket.service';
import { TicketController } from '../presentation/controllers/ticket.controller';
import { TypeOrmTicketRepository } from '../infrastructure/typeorm/repositories/typeorm-ticket.repository';
import { HateoasService } from '../application/services/hateoas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [TicketController],
  providers: [
    TicketService,
    HateoasService,
    {
      provide: 'ITicketRepository',
      useClass: TypeOrmTicketRepository,
    },
  ],
  exports: [TicketService, HateoasService],
})
export class TicketModule {}