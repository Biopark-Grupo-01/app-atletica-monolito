import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/domain/entities/news.entity';
import { NewsService } from 'src/application/services/news.service';
import { NewsController } from '../controllers/news.controller';
import { NEWS_REPOSITORY_TOKEN } from 'src/domain/repositories/news.repository';
import { TypeOrmNewsRepository } from 'src/infrastructure/typeorm/repositories/typeorm-news.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'postgres',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres123',
      database: process.env.DATABASE_NAME || 'atletica',
      autoLoadEntities: true,
      synchronize: true,
    }),

    TypeOrmModule.forFeature([News]),
  ],
  controllers: [NewsController],
  providers: [
    {
      provide: NEWS_REPOSITORY_TOKEN,
      useClass: TypeOrmNewsRepository,
    },
    NewsService,
  ],
  exports: [NewsService],
})
export class NewsModule {}
