// app.module.ts
import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}