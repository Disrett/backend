# Explication — Architecture générale

Ce document explique comment le backend est structuré et pourquoi. Il vise la
compréhension, pas l'action : pour des étapes concrètes, va dans
[how-to/](../how-to/).

## Vue d'ensemble

Sans Limites est un réseau social sportif. Le backend est une API NestJS qui
sert un frontend Next.js. Il expose deux surfaces :

- une **API REST** sous `/api` pour l'essentiel des fonctionnalités ;
- une **couche temps réel** (WebSocket) pour la messagerie.

La persistance repose sur PostgreSQL, manipulé via Prisma. L'authentification est
sans état, par JWT.

## Le découpage en modules

Chaque domaine métier est un module NestJS autonome, importé par le module racine
`AppModule`. Un module type comprend trois fichiers :

- le **contrôleur** route les requêtes HTTP et délègue ;
- le **service** porte la logique métier et les accès à la base ;
- le **module** déclare et câble le tout.

Ce découpage rend chaque domaine compréhensible isolément et reproductible. Le
module `posts` joue le rôle de référence : les modules à venir (`groups`,
`events`, `sports`, `challenges`) répliquent son patron. C'est un choix délibéré
de cohérence — un seul patron à apprendre pour toute l'équipe.

Modules présents : `auth`, `users`, `posts`, `messaging`, `notifications`, plus
le module transverse `prisma`.

## Le rôle central de Prisma

`PrismaService` étend le client Prisma et se connecte au démarrage. Son module
est **global** : tout service peut l'injecter sans réimporter quoi que ce soit.
Ce choix évite la répétition et fait de la base une dépendance partagée unique.

La conséquence : la logique d'accès aux données vit dans les services, jamais
dans les contrôleurs. Un contrôleur ne sait pas comment une donnée est stockée.

## Le pipeline d'une requête HTTP

1. La requête arrive sous `/api` (préfixe global posé dans `main.ts`).
2. Le **CORS** filtre l'origine : en développement, localhost et le réseau privé
   sont tolérés ; en production, seules les origines de `FRONTEND_URL` passent.
3. Sur une route protégée, `JwtAuthGuard` valide le token et attache l'utilisateur.
4. Le **ValidationPipe** global valide le corps contre le DTO et retire les
   champs inconnus.
5. Le contrôleur appelle le service, qui parle à Prisma et renvoie le résultat.

Cette chaîne est uniforme : la sécurité et la validation ne sont pas répétées
route par route, elles sont posées une fois et appliquées partout.

## Sécurité par défaut

Plusieurs choix protègent les données sans effort du développeur : les profils
publics excluent explicitement le `passwordHash` (`select` restreint) ; les
messages d'authentification restent génériques pour ne pas révéler l'existence
d'un compte ; la suppression d'un post par un tiers renvoie `404` plutôt que
`403`, pour ne pas divulguer son existence.

## Ce qui reste ouvert

Le dépôt est un **squelette fondateur**. Les modules `groups`, `events`,
`sports` et `challenges` ont leurs modèles Prisma prêts mais pas encore de code
applicatif. Un module `upload` reste à créer pour produire les URL d'images. La
connexion WebSocket attend son guard d'authentification. Ces choix sont assumés :
poser des fondations solides et homogènes avant d'étendre.

## Pour aller plus loin

- [Authentification](./authentification.md)
- [Messagerie temps réel](./messagerie-temps-reel.md)
- [Environnement reproductible](./environnement-reproductible.md)
- [Registres de décision](../adr/)
