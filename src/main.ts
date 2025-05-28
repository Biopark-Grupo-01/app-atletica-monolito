import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API da Atlética')
    .setDescription('API para gerenciamento de produtos da Atlética')
    .setVersion('1.0')
    .addTag('products', 'Operações relacionadas a produtos')
    .addTag('events', 'Operações relacionadas a eventos')
    .build();

  const document = SwaggerModule.createDocument(app, config)

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('app.apiPrefix');

  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  const port = configService.get<number>('app.port') || 3001;
  await app.listen(port);
}
void bootstrap();
