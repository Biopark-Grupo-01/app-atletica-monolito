import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from './news/news.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME, // user
      password: process.env.DB_PASSWORD, // pass
      database: process.env.DB_DATABASE, // appdb
      synchronize: true,
      autoLoadEntities: true,
    }),
    NewsModule,
  ],
})
export class AppModule {}
