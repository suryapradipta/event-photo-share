import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
  console.log('Application is running on: http://localhost:3001');
}

bootstrap();
