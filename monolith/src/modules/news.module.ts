import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { News } from '../domain/entities/news.entity';
import { TypeOrmNewsRepository } from '../infrastructure/typeorm/repositories/typeorm-news.repository';
import { NEWS_REPOSITORY } from '../domain/repositories/news.repository.interface';
import { NewsService } from '../application/services/news.service';
import { NewsController } from '../presentation/controllers/news.controller';
import { HateoasService } from '../application/services/hateoas.service';
import { UserModule } from './user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([News]), UserModule, NotificationModule],
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
