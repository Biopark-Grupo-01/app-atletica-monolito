import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './presentation/modules/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
