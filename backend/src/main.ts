import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS : autorise le front Next.js (cookies/headers d'auth).
  // - En production : uniquement les origines listées dans FRONTEND_URL
  //   (séparées par des virgules), ex. "https://sanslimites.fr,https://www.sanslimites.fr".
  // - En développement : on autorise EN PLUS localhost, 127.0.0.1 et les IP de
  //   réseau local (192.168.x, 10.x, 172.16–31.x) sur n'importe quel port, afin
  //   que le site fonctionne qu'on l'ouvre via http://localhost:3000 OU via
  //   l'URL « Network » que Next.js affiche (ex. http://192.168.1.21:3000).
  const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const isProduction = process.env.NODE_ENV === 'production';
  const lanOriginRegex =
    /^https?:\/\/(localhost|127\.0\.0\.1|(?:10|192\.168|172\.(?:1[6-9]|2\d|3[01]))(?:\.\d{1,3}){2,3})(?::\d+)?$/;

  app.enableCors({
    origin: (origin, callback) => {
      // Pas d'origine = appel serveur-à-serveur, curl, ou même origine → autorisé.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // En dev, on tolère localhost et les IP de réseau privé.
      if (!isProduction && lanOriginRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origine non autorisée par CORS : ${origin}`), false);
    },
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