import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS : autorise uniquement le front Next.js (cookies/headers d'auth)
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Validation globale : tout DTO est validé, les champs inconnus sont retirés
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: true, // erreur si propriété inattendue
      transform: true, // transforme les payloads en instances de DTO typées
    }),
  );

  app.setGlobalPrefix('api'); // toutes les routes sous /api

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 API Sans Limites démarrée sur http://localhost:${port}/api`);
}
bootstrap();
