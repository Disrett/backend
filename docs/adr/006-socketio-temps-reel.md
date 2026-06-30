# ADR-006 : Socket.io pour la messagerie temps réel

## Statut

Accepté

## Contexte

La messagerie exige du temps réel bidirectionnel : nouveaux messages, indicateur
de saisie, accusés de lecture, présence. Le frontend est un client web.

## Décision

Nous utilisons **Socket.io** via `@nestjs/platform-socket.io`, exposé par une
`MessagingGateway`. Les clients rejoignent une « room » par conversation
(`conv:<id>`) ; les messages sont persistés puis diffusés à la room.

## Conséquences

- Positif : intégration NestJS native, gestion des rooms et reconnexion incluses.
- Positif : Traefik proxifie les WebSockets sans configuration supplémentaire.
- Négatif : le déploiement reste à **1 réplique**. Passer à plusieurs répliques
  exige un **adaptateur Redis** Socket.io et des sticky sessions.
- À surveiller : la connexion n'est pas encore authentifiée (ajouter un `WsJwtGuard`).
