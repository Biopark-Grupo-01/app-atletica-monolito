// Importar o polyfill antes de qualquer outra coisa
import './infrastructure/config/polyfills';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API da Atlética')
    .setDescription('API para gerenciamento de produtos da Atlética')
    .setVersion('1.0')
    .addTag('products', 'Operações relacionadas a produtos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
