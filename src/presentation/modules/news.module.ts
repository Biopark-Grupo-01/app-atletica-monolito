import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../domain/entities/news.entity';
import { NewsService } from '../application/services/news.service';
import { NewsController } from './news.controller';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [
    NewsService,
    HateoasService,
    { provide: NEWS_REPOSITORY, useClass: TypeOrmNewsRepository },
  ],
  exports: [NewsService],
})
export class NewsModule {}
