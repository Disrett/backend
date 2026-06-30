# ADR-001 : NestJS comme framework applicatif

## Statut

Accepté

## Contexte

Le backend expose une API REST et une couche temps réel pour un réseau social.
Il faut une structure claire (modules par domaine), l'injection de dépendances,
la validation des entrées et une intégration WebSocket native, le tout en
TypeScript pour partager le typage avec le frontend Next.js.

## Décision

Nous utilisons **NestJS 11** (TypeScript). Chaque domaine est un module
(`module` + `controller` + `service`), avec un `ValidationPipe` global et le
support WebSocket via `@nestjs/platform-socket.io`.

## Conséquences

- Positif : architecture modulaire homogène ; le module `posts` sert de patron
  réplicable ; validation, guards et gateways WebSocket fournis nativement.
- Positif : injection de dépendances qui rend `PrismaService` trivial à partager.
- Négatif : surcouche et décorateurs à apprendre par rapport à Express nu.
- À surveiller : la version de NestJS doit rester alignée sur ses sous-paquets
  (`@nestjs/*` tous en 11.x).
