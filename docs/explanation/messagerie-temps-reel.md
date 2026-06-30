# Explication — Messagerie temps réel

Ce document explique pourquoi la messagerie passe par WebSocket plutôt que par
HTTP, comment les messages circulent, et ce qui contraint sa mise à l'échelle.

## Pourquoi le temps réel

Une messagerie a besoin de pousser de l'information vers le client sans qu'il la
demande : un nouveau message, un indicateur de saisie, un accusé de lecture. Le
modèle requête-réponse de HTTP s'y prête mal (il faudrait interroger le serveur
en boucle). Un canal WebSocket bidirectionnel et persistant répond directement à
ce besoin.

## Le modèle de « rooms »

Chaque conversation correspond à une room Socket.io nommée `conv:<conversationId>`.
Un client rejoint la room des conversations qui le concernent. Quand un message
arrive, le serveur ne le diffuse qu'aux membres de cette room, pas à tout le
monde. Ce cloisonnement garde les échanges privés et limite le trafic.

## Le trajet d'un message

1. Le client émet `message:send` avec le contenu et la conversation.
2. La gateway persiste le message via le service (il survit donc à la session).
3. Le service remonte la conversation en tête de liste (`updatedAt`).
4. La gateway diffuse `message:new` à la room : tous les membres présents le
   reçoivent instantanément.

La persistance d'abord, la diffusion ensuite : un membre absent au moment de
l'envoi retrouvera le message dans l'historique à sa reconnexion.

## Accusés de lecture

`message:read` marque comme lus les messages reçus par l'utilisateur (ceux dont
il n'est pas l'expéditeur et qui n'ont pas encore de `readAt`). Le champ `readAt`
matérialise la « double coche » : `null` signifie non lu, une date signifie lu.

## La contrainte de mise à l'échelle

Socket.io maintient l'état des rooms **en mémoire** dans le processus. Avec
plusieurs répliques de l'API, deux clients d'une même conversation pourraient
être connectés à des instances différentes et ne plus se voir. C'est pourquoi le
déploiement reste à **1 réplique**.

Pour dépasser cette limite, il faut un **adaptateur Redis** : Redis relaie alors
les événements entre instances, et des sticky sessions garantissent qu'un client
reste sur la même instance. Ce choix est tracé dans
[ADR-006](../adr/006-socketio-temps-reel.md).

## Ce qui reste à faire

La connexion n'est pas authentifiée (pas de `WsJwtGuard`), et la présence
« en ligne / hors ligne » est esquissée mais pas diffusée. Les notifications
pourraient réutiliser le même principe de gateway pour être poussées en direct.
