import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { News } from 'src/domain/entities/news.entity';
import { TypeOrmNewsRepository } from 'src/infrastructure/typeorm/repositories/typeorm-news.repository';
import { NEWS_REPOSITORY } from 'src/domain/repositories/news.repository.interface';
import { NewsService } from 'src/application/services/news.service';
import { NewsController } from 'src/presentation/controllers/news.controller';
import { HateoasService } from 'src/application/services/hateoas.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: false,
        retryAttempts: 5,
        retryDelay: 3000,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([News]),
  ],
  controllers: [NewsController],
  providers: [
    {
      provide: NEWS_REPOSITORY,
      useClass: TypeOrmNewsRepository,
    },
    NewsService,
    HateoasService,
  ],
})
export class NewsModule {}
