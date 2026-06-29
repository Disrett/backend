# AGENTS.md — Backend Sans Limites

API du réseau social sportif **Sans Limites**. Tu travailles sur le backend uniquement.

## Stack

- NestJS 11 (TypeScript 5.7), Node.js 22
- Prisma 6 + PostgreSQL 16
- Auth : Passport JWT (access + refresh) + argon2
- Temps réel : Socket.io (`@nestjs/platform-socket.io`)
- Environnement : Nix/Lix (flake) ; déploiement de test : k3d + Task

## Commandes (les vraies, pas les conventionnelles)

Développement local (hors cluster) :

- `npm run start:dev` — API en watch sur `http://localhost:3001/api`
- `npm run build` — compile via `nest build` vers `dist/`
- `npm run lint` — ESLint avec `--fix` sur `{src,test}/**/*.ts`
- `npm run prisma:migrate` — `prisma migrate dev` (crée/applique les migrations)
- `npm run prisma:generate` — régénère le client Prisma
- `npm run prisma:studio` — interface web d'inspection de la base
- `npm run db:seed` — peuple la base (comptes de démo, mot de passe `password123`)

Déploiement k3d (depuis le devShell Nix) :

- `task` — liste les tâches
- `task registry && task up` — registre local puis cluster (idempotent)
- `task build && task push && task deploy` — image, push, manifestes + rollout
- `task redeploy` — cycle de dev (rebuild + push + restart)
- `task logs` — logs de l'API en direct
- `./smoke-test.sh` — test de bout en bout de l'API (curl + jq)

## Environnement Nix/Lix

- Entre dans le shell outillé avec `nix develop` (ou `direnv allow`).
- **Lance `git add -A` AVANT `nix develop`** : un flake ignore les fichiers non suivis par Git, donc un nouveau fichier non `add`é est invisible dans le shell.
- Le flake câble Prisma sur `prisma-engines` de nixpkgs via des variables (`PRISMA_*`). Ne réécris pas ces variables. Vérifie que `prisma --version` correspond à `@prisma/client` du `package.json`.

## Architecture (3 répertoires à connaître)

- `prisma/schema.prisma` — modèle de données complet (source de vérité de toutes les entités).
- `src/<domaine>/` — un module par domaine : `auth`, `users`, `posts`, `messaging`, `notifications`. Chaque module = `*.module.ts` + `*.controller.ts` + `*.service.ts` (+ `dto/`).
- `src/prisma/` — `PrismaService` global, injecté dans tous les services qui touchent la base.

`src/posts/` est le **module de référence** : réplique son patron pour tout nouveau module.

## Conventions (ce que les linters ne voient pas)

- Toutes les routes HTTP vivent sous le préfixe `/api` (`setGlobalPrefix` dans `main.ts`).
- Un service reçoit ses dépendances par injection (`constructor(private readonly prisma: PrismaService)`).
- Valide toute entrée avec un DTO `class-validator` dans `dto/`. Le `ValidationPipe` global rejette les champs inconnus (`whitelist` + `forbidNonWhitelisted`).
- Protège une route privée avec `@UseGuards(JwtAuthGuard)` ; récupère l'utilisateur avec `@CurrentUser()` (renvoie `{ id, username }`).
- Identifiants en `cuid()`. Ne les remplace pas par des entiers auto-incrémentés.
- Les noms de tables SQL passent par `@@map(...)` en `snake_case` ; les champs `created_at`/`updated_at` aussi via `@map(...)`.
- Messages d'auth volontairement génériques (« Identifiants invalides ») : ne révèle jamais si un email existe.

## Limites (à ne jamais faire)

- Ne stocke **jamais** d'image en base : seules des `imageUrl` pointant vers un stockage objet sont permises.
- Ne commit **jamais** de secret réel. Les `k8s/*-secret.yaml` et `.env.example` ne contiennent que des valeurs de TEST.
- Ne passe pas le `replicas` du déploiement au-dessus de 1 sans adaptateur Redis Socket.io + sticky sessions (la messagerie casserait).
- Ne « simplifie » pas davantage `/auth/refresh` : il l'est déjà volontairement (voir ADR-003).
- Ne supprime pas de fichiers pour résoudre une erreur, ne force-push pas, ne désactive pas la validation des DTO.

## Définition de « Terminé »

Une tâche est terminée quand TOUT ce qui suit passe :

1. `npm run build` compile sans erreur.
2. `npm run lint` ne signale plus rien.
3. `npx prisma validate` accepte le schéma (si tu as touché à `schema.prisma`).
4. `./smoke-test.sh` réussit de bout en bout quand l'API tourne.
5. Le message de commit suit Conventional Commits : `type(scope): description`.

## Quand tu es bloqué

- Build qui échoue après 3 tentatives : arrête-toi et rapporte l'erreur exacte.
- Dépendance manquante : vérifie d'abord `package.json`, n'installe rien sans demander.
- Erreur Prisma « engine » en local : tu es probablement hors du devShell Nix → relance `nix develop`.
- Le client Prisma semble désynchronisé du schéma : lance `npm run prisma:generate` avant d'investiguer.

## Décisions d'architecture (déjà tranchées — ne pas re-proposer)

- NestJS plutôt qu'Express nu (ADR-001).
- Prisma + PostgreSQL plutôt qu'un ORM/SGBD alternatif (ADR-002).
- JWT access+refresh avec rotation + argon2 (ADR-003).
- Nix/Lix pour l'environnement reproductible (ADR-004).
- k3d pour le déploiement de test (ADR-005).
- Socket.io pour le temps réel (ADR-006).

Détail complet et conséquences : `docs/adr/`.

## Sections par tâche

### Quand tu ajoutes un module

- Suis `docs/how-to/ajouter-un-module.md` et copie le patron de `src/posts/`.
- Enregistre le module dans `src/app.module.ts`.
- Les modèles Prisma de `groups`, `events`, `sports`, `challenges` existent déjà : ne les recrée pas.

### Quand tu écris du code

- Lance `npm run lint` après chaque modification de fichier.
- Type tout : `noImplicitAny` est désactivé mais `strictNullChecks` est actif.

### Quand tu touches à la base

- Modifie `prisma/schema.prisma`, puis `npm run prisma:migrate` (génère la migration), puis `npm run prisma:generate`.
- En cluster, le schéma est synchronisé par un initContainer (`prisma db push`) au démarrage.

## Divulgation progressive

- Référence API HTTP : `docs/reference/api-http.md` et `openapi.yaml`.
- Modèle de données : `docs/reference/modele-de-donnees.md`.
- Événements WebSocket : `docs/reference/evenements-websocket.md`.
- Déploiement détaillé : `DEPLOY.md` et `docs/explanation/environnement-reproductible.md`.

## Boucle d'amélioration

En fin de session, résume ce que tu as appris et propose des ajouts à ce fichier (commandes découvertes, conventions mal interprétées, contexte manquant). Toute modification de `AGENTS.md` passe par une revue, comme du code.
