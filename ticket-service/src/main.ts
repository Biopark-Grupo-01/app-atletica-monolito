import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

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
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/tickets');
  
  const port = configService.get<number>('PORT') || 3002;
  
  console.log(`==============================================`);
  console.log(`🎫 Ticket service running on port: ${port}`);
  console.log(`🔗 Connected to monolith at: ${configService.get('MONOLITH_SERVICE_URL')}`);
  console.log(`==============================================`);
  
  await app.listen(port);
}

bootstrap();