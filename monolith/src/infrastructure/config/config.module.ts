import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import appConfig from './app.config';
import databaseConfig from './database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [appConfig, databaseConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
