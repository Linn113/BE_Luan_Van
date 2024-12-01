import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedData } from './database/seed-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const expressApp = app.getHttpAdapter().getInstance(); // Get the underlying Express app
  expressApp.set('trust proxy', true);

  // const dataSource = app.get(DataSource);
  // await seedData(dataSource); 

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
