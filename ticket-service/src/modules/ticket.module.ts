import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { Ticket } from '../domain/entities/ticket.entity';
import { TicketService } from '../application/services/ticket.service';
import { TicketController } from '../presentation/controllers/ticket.controller';
import { TypeOrmTicketRepository } from '../infrastructure/typeorm/repositories/typeorm-ticket.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [TicketController],
  providers: [
    TicketService,
    {
      provide: 'ITicketRepository',
      useClass: TypeOrmTicketRepository,
    },
  ],
  exports: [TicketService],
})
export class TicketModule {}