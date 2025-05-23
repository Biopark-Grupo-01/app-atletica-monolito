import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres123'),
        database: configService.get('DATABASE_NAME', 'atletica'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true, // Forçando a sincronização para true
        logging: true, // Habilitando logs para debug
        autoLoadEntities: true,
        connectTimeoutMS: 20000,
      }),
    }),
  ],
})
export class DatabaseModule {}
