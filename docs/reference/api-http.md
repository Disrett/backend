# Référence — API HTTP

Toutes les routes sont préfixées par `/api`. Le contrat formel et machine-lisible
se trouve dans [`openapi.yaml`](../../openapi.yaml) ; ce document en est la vue
synthétique.

Base URL locale : `http://localhost:3001/api`. Base URL cluster k3d :
`http://localhost:8080/api`.

L'authentification est par JWT. Les routes marquées **Bearer** exigent l'en-tête
`Authorization: Bearer <accessToken>`.

## auth

| Méthode | Chemin | Auth | Corps | Réponse |
|---|---|---|---|---|
| POST | `/auth/register` | — | `{ email, password, username, name }` | `201` `{ accessToken, refreshToken }` ; `409` si email ou username déjà pris |
| POST | `/auth/login` | — | `{ email, password }` | `200` `{ accessToken, refreshToken }` ; `401` si identifiants invalides |
| POST | `/auth/logout` | Bearer | — | `200` `{ success: true }` |
| POST | `/auth/refresh` | — | `{ userId, refreshToken }` | `200` `{ accessToken, refreshToken }` ; `401` si refresh invalide |

L'access token expire après 15 minutes, le refresh token après 7 jours (valeurs
par défaut, voir [variables-environnement.md](./variables-environnement.md)).

## users

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| GET | `/users/:username` | — | Profil public (jamais le `passwordHash`), avec compteurs `followers`, `following`, `posts`. `404` si introuvable. |
| POST | `/users/:id/follow` | Bearer | Suivre l'utilisateur `:id`. |
| DELETE | `/users/:id/follow` | Bearer | Ne plus suivre `:id`. |

## posts

| Méthode | Chemin | Auth | Corps | Description |
|---|---|---|---|---|
| GET | `/posts?cursor=<id>` | — | — | Fil d'actualité, 20 éléments par page, du plus récent au plus ancien. `cursor` = id du dernier post reçu. Inclut l'auteur et les compteurs `likes`/`comments`. |
| POST | `/posts` | Bearer | `{ title?, content?, imageUrl?, sportId? }` | Crée une publication. |
| DELETE | `/posts/:id` | Bearer | — | Supprime sa propre publication. `404` si elle n'existe pas ou n'appartient pas à l'appelant. |
| POST | `/posts/:id/like` | Bearer | — | Like idempotent (pas de doublon). |
| DELETE | `/posts/:id/like` | Bearer | — | Retire le like (sans erreur s'il était déjà absent). |
| POST | `/posts/:id/comments` | Bearer | `{ content }` | Ajoute un commentaire. |

## notifications

Toutes ces routes exigent **Bearer**.

| Méthode | Chemin | Description |
|---|---|---|
| GET | `/notifications` | Notifications de l'appelant (50 max), non lues d'abord. |
| PATCH | `/notifications/read-all` | Marque toutes les notifications comme lues. |
| DELETE | `/notifications/:id` | Supprime une notification de l'appelant. |

## Validation et erreurs

- Toute entrée est validée par un DTO `class-validator`. Un champ inconnu ou
  invalide produit un `400` avec le détail des contraintes violées.
- Contraintes notables : mot de passe de 8 à 72 caractères ; `username` de 3 à 30
  caractères restreint à `[a-zA-Z0-9._-]` ; `content` de commentaire de 1 à 1000
  caractères ; `title` de post ≤ 120, `content` ≤ 2000, `imageUrl` doit être une URL.

## Messagerie

La messagerie ne passe pas par HTTP mais par WebSocket. Voir
[evenements-websocket.md](./evenements-websocket.md).
