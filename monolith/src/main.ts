import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitando CORS para permitir requisições do frontend
  app.enableCors({
    origin: '*', // Em ambiente de produção, especifique as origens permitidas
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('app.apiPrefix');

  // Configuração do Swagger
  const configBuilder = new DocumentBuilder()
    .setTitle('API da Atlética')
    .setDescription('API para gerenciamento de produtos da Atlética')
    .setVersion('1.0');

  if (apiPrefix) {
    configBuilder.addServer(`/${apiPrefix}`);
  }

  const config = configBuilder.build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPrefix ? `${apiPrefix}/docs` : 'docs', app, document);

  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

const port = configService.get<number>('app.port') || 3001;
console.log(`==============================================`);
console.log(`Monolith service running on port: ${port}`);
console.log(`==============================================`);
await app.listen(port);
}
void bootstrap();
