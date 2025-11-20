import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🔹 Swagger config
  const config = new DocumentBuilder()
    .setTitle('GDash API')
    .setDescription('API do desafio (users, weather, etc.)')
    .setVersion('1.0.0')
    .addBearerAuth() // já deixa pronto pro JWT depois
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // URL final: http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`API running on port ${port}`);
}
bootstrap();
