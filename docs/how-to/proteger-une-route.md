# Protéger une route et récupérer l'utilisateur connecté

Ce guide montre comment exiger une authentification sur une route HTTP et
accéder à l'utilisateur courant.

## Exiger un token sur une route

Pose le guard `JwtAuthGuard` sur la méthode du contrôleur. Le guard vérifie
l'en-tête `Authorization: Bearer <token>` et rejette la requête avec un `401`
si le token manque, est invalide ou a expiré.

```ts
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Post()
create(@Body() dto: CreateThingDto) {
  return this.things.create(dto);
}
```

## Protéger tout un contrôleur

Pour appliquer le guard à toutes les routes d'un contrôleur, pose-le sur la
classe (comme `NotificationsController`) :

```ts
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController { /* ... */ }
```

## Récupérer l'utilisateur courant

Utilise le décorateur `@CurrentUser()`. Il renvoie l'objet produit par
`JwtStrategy.validate`, soit `{ id, username }`.

```ts
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Post()
create(@CurrentUser() me: { id: string }, @Body() dto: CreateThingDto) {
  return this.things.create(me.id, dto);
}
```

## Côté client

Le client envoie le token reçu de `/auth/register` ou `/auth/login` :

```
Authorization: Bearer <accessToken>
```

L'access token expire après 15 minutes. Si tu reçois un `401`, renouvelle-le via
`/auth/refresh` (voir [explanation/authentification.md](../explanation/authentification.md)).

## Cas particulier : WebSocket

Les routes HTTP sont couvertes par `JwtAuthGuard`, mais la **connexion WebSocket
ne l'est pas encore**. Pour la protéger, ajoute un `WsJwtGuard` qui valide
`socket.handshake.auth.token` dans `MessagingGateway.handleConnection`.
