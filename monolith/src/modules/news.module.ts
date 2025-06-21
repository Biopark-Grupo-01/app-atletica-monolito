import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { News } from 'src/domain/entities/news.entity';
import { TypeOrmNewsRepository } from 'src/infrastructure/typeorm/repositories/typeorm-news.repository';
import { NEWS_REPOSITORY } from 'src/domain/repositories/news.repository.interface';
import { NewsService } from 'src/application/services/news.service';
import { NewsController } from 'src/presentation/controllers/news.controller';
import { HateoasService } from 'src/application/services/hateoas.service';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [
    NewsService,
    HateoasService,
    {
      provide: NEWS_REPOSITORY,
      useClass: TypeOrmNewsRepository,
    },
  ],
  exports: [NewsService, NEWS_REPOSITORY],
})
export class NewsModule {}
