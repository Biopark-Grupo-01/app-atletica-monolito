import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TicketGatewayController } from './controllers/ticket-gateway.controller';
import { TicketGatewayService } from './services/ticket-gateway.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [TicketGatewayController],
  providers: [TicketGatewayService],
})
export class GatewayModule {}
