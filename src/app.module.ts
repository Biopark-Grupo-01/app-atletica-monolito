import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'sua-senha',
      database: 'seu-banco',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Desative isso em produção!
    }),
    NewsModule,
  ],
})
export class AppModule {}
