import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './infrastructure/database/database.module';
import { TicketModule } from './modules/ticket.module';
import { envValidationSchema } from './infrastructure/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    DatabaseModule,
    TicketModule,
  ],
})
export class AppModule {}