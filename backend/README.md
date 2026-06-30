# Sans Limites — Backend

API du réseau social sportif **Sans Limites**.
Stack : **NestJS** (TypeScript) · **Prisma** · **PostgreSQL** · **Passport/JWT** · **Socket.io** (temps réel).

Ce dépôt est un **squelette fondateur** : l'authentification, les utilisateurs, les
publications et la messagerie temps réel sont déjà codés. Les modules restants
(groupes, événements, sports, défis) se construisent sur le **même patron** que
le module `posts`, qui sert de référence.

---

## 1. Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
#    puis renseigner DATABASE_URL et les secrets JWT

# 3. Créer la base et générer le client Prisma
npm run prisma:migrate      # crée les tables à partir de schema.prisma
npm run prisma:generate

# 4. Lancer en développement
npm run start:dev           # API sur http://localhost:3001/api
```

> Pour PostgreSQL en local rapidement :
> `docker run --name sl-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sans_limite -p 5432:5432 -d postgres:16`

---

## 2. Arborescence

```
sans-limite-backend/
├── prisma/
│   └── schema.prisma          # ← LE modèle de données complet (toutes les entités)
├── src/
│   ├── main.ts                # bootstrap : CORS, validation globale, préfixe /api
│   ├── app.module.ts          # module racine, importe tous les autres
│   │
│   ├── prisma/                # service Prisma partagé (global)
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── auth/                  # ✅ inscription, connexion, JWT access+refresh, argon2
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/               # RegisterDto, LoginDto (validés par class-validator)
│   │   ├── strategies/        # JwtStrategy (validation de l'access token)
│   │   ├── guards/            # JwtAuthGuard (à poser sur les routes protégées)
│   │   └── decorators/        # @CurrentUser() → récupère l'utilisateur connecté
│   │
│   ├── users/                # ✅ profil public, follow / unfollow
│   ├── posts/                # ✅ EXEMPLE DE RÉFÉRENCE : feed, création, like, commentaires
│   ├── messaging/            # ✅ temps réel : MessagingGateway (WebSocket) + service
│   ├── notifications/        # ✅ liste, lecture, suppression (réutilisable par les autres modules)
│   └── common/               # (helpers transverses : filtres d'exception, pipes...)
│
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 3. Modules restant à créer (même patron que `posts`)

Pour chacun, générez les fichiers avec la CLI puis remplissez service + DTOs.
Les **modèles Prisma existent déjà** dans `schema.prisma`.

```bash
nest g module groupes && nest g controller groupes && nest g service groupes
```

| Module | Modèles Prisma déjà prêts | Routes typiques |
|---|---|---|
| `sports` | `Sport`, `UserSport` | `GET /sports`, `GET /sports/:slug`, `POST /sports/:id/follow` |
| `groups` | `Group`, `GroupMember` | `GET /groups`, `POST /groups`, `POST /groups/:id/join` |
| `events` | `Event`, `EventParticipant` | `GET /events`, `POST /events`, `POST /events/:id/join` |
| `comments` | `Comment` (déjà géré dans `posts`) | extraire si besoin |
| `challenges` | `Challenge`, `UserChallenge`, `Objective` | `GET /challenges`, `POST /challenges/:id/join`, MAJ progression |

**Le patron à répliquer** (vu dans `posts`) :
1. un `*.service.ts` qui reçoit `PrismaService` par injection ;
2. un `*.controller.ts` avec `@UseGuards(JwtAuthGuard)` sur les routes protégées
   et `@CurrentUser()` pour l'identité ;
3. des DTOs dans `dto/` validés par `class-validator` ;
4. enregistrer le module dans `app.module.ts`.

---

## 4. Routes déjà disponibles

```
POST   /api/auth/register        { email, password, username, name }
POST   /api/auth/login           { email, password }
POST   /api/auth/logout          (Bearer)
POST   /api/auth/refresh         { userId, refreshToken }

GET    /api/users/:username
POST   /api/users/:id/follow     (Bearer)
DELETE /api/users/:id/follow     (Bearer)

GET    /api/posts?cursor=...
POST   /api/posts                (Bearer) { title?, content?, imageUrl?, sportId? }
DELETE /api/posts/:id            (Bearer)
POST   /api/posts/:id/like       (Bearer)
DELETE /api/posts/:id/like       (Bearer)
POST   /api/posts/:id/comments   (Bearer) { content }

GET    /api/notifications        (Bearer)
PATCH  /api/notifications/read-all (Bearer)
DELETE /api/notifications/:id    (Bearer)
```

WebSocket (messagerie) — événements Socket.io :
`conversation:join`, `message:send`, `message:new`, `typing`, `message:read`.

---

## 5. Points d'attention pour la suite

- **Sécurité auth** : le endpoint `/auth/refresh` est volontairement simplifié.
  En production, ajoutez une `JwtRefreshStrategy` Passport dédiée plutôt que de
  passer le refresh token dans le body, et envisagez de stocker les tokens en
  cookies `httpOnly` côté front.
- **WebSocket** : protégez la connexion avec un `WsJwtGuard` qui vérifie le JWT
  passé dans `socket.handshake.auth.token`.
- **Images** : aucune image n'est stockée en base. Ajoutez un module `upload`
  qui renvoie une URL (S3 / Cloudflare R2 / Supabase Storage) que le front passe
  ensuite dans `imageUrl`.
- **Temps réel à l'échelle** : quand vous aurez plusieurs instances du serveur,
  ajoutez l'adaptateur Redis de Socket.io pour synchroniser les rooms.
- **Notifications temps réel** : `NotificationsService` peut être branché à une
  gateway pour pousser les notifs en direct (même principe que `messaging`).
```
