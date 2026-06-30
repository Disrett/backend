# Ajouter un nouveau module

Ce guide montre comment ajouter un module de domaine (par exemple `groups`,
`events`, `sports` ou `challenges`) en répliquant le patron du module de
référence `src/posts/`. Les modèles Prisma de ces domaines existent déjà dans
`schema.prisma` : tu n'as pas à les créer.

## Générer le squelette

Depuis le devShell, génère les trois fichiers de base :

```bash
nest g module groups
nest g controller groups
nest g service groups
```

La CLI les place sous `src/groups/` et enregistre le module dans `app.module.ts`.
Vérifie cet enregistrement ; ajoute-le à la main s'il manque.

## Câbler le service à la base

Le service reçoit `PrismaService` par injection et porte toute la logique métier :

```ts
@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  feed() {
    return this.prisma.group.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
```

Comme `PrismaModule` est global, aucun import supplémentaire n'est nécessaire.

## Valider les entrées avec un DTO

Crée un dossier `dto/` et un DTO par payload, validé par `class-validator` :

```ts
export class CreateGroupDto {
  @IsString() @MinLength(3) @MaxLength(80)
  name: string;

  @IsOptional() @IsString() @MaxLength(2000)
  description?: string;
}
```

Le `ValidationPipe` global rejette tout champ non déclaré : tu n'as rien à
configurer dans le contrôleur.

## Protéger les routes

Pose `@UseGuards(JwtAuthGuard)` sur les routes qui exigent une authentification,
et récupère l'utilisateur avec `@CurrentUser()` :

```ts
@UseGuards(JwtAuthGuard)
@Post()
create(@CurrentUser() me: { id: string }, @Body() dto: CreateGroupDto) {
  return this.groups.create(me.id, dto);
}
```

Laisse publiques les routes de lecture qui n'ont pas besoin d'identité (par
exemple `GET /groups`).

## Suivre le découpage des responsabilités

- Le **contrôleur** ne fait que router : il appelle le service et renvoie son résultat.
- Le **service** porte la logique et les accès Prisma.
- Le **DTO** valide et type l'entrée.

Si tu as besoin de l'idempotence (comme un like ou un membre de groupe), utilise
une contrainte `@@unique` dans le schéma et `upsert` côté service, à l'image de
`PostsService.like`.

## Notifier les autres utilisateurs (optionnel)

Si l'action concerne quelqu'un d'autre (rejoindre un groupe, suivre, commenter),
importe `NotificationsService` (déjà exporté par son module) et appelle
`create(...)` avec le bon `NotificationType`.

## Vérifier

Avant d'ouvrir une PR, assure-toi que la Définition de « Terminé » passe :

```bash
npm run build
npm run lint
```

Puis teste manuellement avec `requests.http` ou `curl`. Documente les nouvelles
routes dans [`openapi.yaml`](../../openapi.yaml) et
[`reference/api-http.md`](../reference/api-http.md).

## Modules restant à créer

| Module | Modèles Prisma prêts | Routes typiques |
|---|---|---|
| `sports` | `Sport`, `UserSport` | `GET /sports`, `GET /sports/:slug`, `POST /sports/:id/follow` |
| `groups` | `Group`, `GroupMember` | `GET /groups`, `POST /groups`, `POST /groups/:id/join` |
| `events` | `Event`, `EventParticipant` | `GET /events`, `POST /events`, `POST /events/:id/join` |
| `challenges` | `Challenge`, `UserChallenge`, `Objective` | `GET /challenges`, `POST /challenges/:id/join` |
