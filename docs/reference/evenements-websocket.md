# Référence — Événements WebSocket

La messagerie temps réel passe par Socket.io, exposé par `MessagingGateway`.
L'origine CORS autorisée est `FRONTEND_URL` (défaut `http://localhost:3000`).

Les clients sont regroupés par « room » de conversation, nommée `conv:<conversationId>`.

## Événements entrants (client → serveur)

| Événement | Charge utile | Effet |
|---|---|---|
| `conversation:join` | `{ conversationId }` | Rejoint la room de la conversation pour en recevoir les messages. |
| `message:send` | `{ conversationId, senderId, content }` | Persiste le message, remonte la conversation en tête, puis diffuse `message:new` à la room. |
| `typing` | `{ conversationId, username }` | Diffuse `typing` aux autres membres de la room. |
| `message:read` | `{ conversationId, userId }` | Marque comme lus les messages reçus par `userId`, puis diffuse `message:read`. |

## Événements sortants (serveur → client)

| Événement | Charge utile | Sens |
|---|---|---|
| `message:new` | l'objet message persisté | Un nouveau message est arrivé dans la conversation. |
| `typing` | `{ username }` | Un membre est en train d'écrire. |
| `message:read` | `{ userId }` | `userId` a lu les messages (double coche). |

## Cycle de vie

- `handleConnection` / `handleDisconnect` journalisent la connexion. La diffusion
  de présence « en ligne / hors ligne » et l'authentification du socket restent à
  implémenter.

## Authentification (à implémenter)

La connexion n'est pas encore protégée. La cible : un `WsJwtGuard` qui valide le
JWT passé dans `socket.handshake.auth.token` avant d'autoriser la connexion (voir
[ADR-006](../adr/006-socketio-temps-reel.md)).

## Mise à l'échelle

Le déploiement tourne à 1 réplique. Plusieurs répliques exigent un adaptateur
Redis Socket.io et des sticky sessions.
