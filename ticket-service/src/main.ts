import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/tickets');
  app.enableCors();
  
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`==============================================`);
  console.log(`Ticket service running on port: ${port}`);
  console.log(`==============================================`);
}

bootstrap();