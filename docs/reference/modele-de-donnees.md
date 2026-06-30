# Référence — Modèle de données

La source de vérité est [`prisma/schema.prisma`](../../prisma/schema.prisma).
Ce document décrit les entités, leurs relations et les énumérations. Les
identifiants sont des `cuid()` (voir [ADR-007](../adr/007-cuid-identifiants.md)).
Aucune image n'est stockée en base : seules des URL le sont (voir
[ADR-008](../adr/008-images-url-stockage-objet.md)).

## Énumérations

| Enum | Valeurs |
|---|---|
| `GroupVisibility` | `PUBLIC`, `PRIVATE` |
| `GroupRole` | `ORGANIZER`, `CO_ORGANIZER`, `MEMBER` |
| `EventRole` | `ORGANIZER`, `VOLUNTEER`, `PARTICIPANT` |
| `NotificationType` | `LIKE`, `COMMENT`, `FOLLOW`, `CHALLENGE`, `EVENT`, `GROUP`, `MESSAGE`, `SYSTEM` |

## Utilisateurs et graphe social

| Modèle | Table | Rôle |
|---|---|---|
| `User` | `users` | Compte. Champs notables : `email` (unique), `passwordHash`, `username` (unique), `name`, `avatarUrl?`, `bio?`, `location?`, `primarySport?`, `hashedRefreshToken?`. |
| `Follow` | `follows` | Abonnement orienté `follower → following`. Unique sur `(followerId, followingId)` : on ne suit une personne qu'une fois. |

## Sports

| Modèle | Table | Rôle |
|---|---|---|
| `Sport` | `sports` | Catégorie sportive. `slug` unique, `name`, `tagline?`, `description?`, `imageUrl?`, `accent?` (classe de dégradé Tailwind). |
| `UserSport` | `user_sports` | Liaison `User ↔ Sport` (sports suivis). Clé primaire composite `(userId, sportId)`. |

## Publications

| Modèle | Table | Rôle |
|---|---|---|
| `Post` | `posts` | Publication. `authorId`, `title?`, `content?`, `imageUrl?`, `sportId?`. Indexée sur `authorId` et `createdAt`. |
| `Like` | `likes` | Like d'un post. Unique sur `(userId, postId)` : un like par utilisateur et par post. |
| `Comment` | `comments` | Commentaire sur un post. `postId`, `authorId`, `content`. |

## Groupes

| Modèle | Table | Rôle |
|---|---|---|
| `Group` | `groups` | Groupe communautaire. `slug` unique, `name`, descriptions, `city?`, `level?`, `frequency?`, `maxMembers?`, `visibility` (défaut `PUBLIC`). |
| `GroupMember` | `group_members` | Adhésion. Clé composite `(groupId, userId)`, `role` (défaut `MEMBER`). |

## Événements

| Modèle | Table | Rôle |
|---|---|---|
| `Event` | `events` | Événement sportif. `title`, `startsAt`, `location?`, `level?`, `maxParticipants?`, `organizerId`. Indexé sur `startsAt`. |
| `EventParticipant` | `event_participants` | Participation. Clé composite `(eventId, userId)`, `role` (défaut `PARTICIPANT`). |

## Messagerie

| Modèle | Table | Rôle |
|---|---|---|
| `Conversation` | `conversations` | Conversation 1:1 ou de groupe (`isGroup`). `title?` pour les groupes. |
| `ConversationParticipant` | `conversation_participants` | Participant d'une conversation. Clé composite `(conversationId, userId)`. |
| `Message` | `messages` | Message. `senderId`, `content`, `imageUrl?`, `readAt?` (null = non lu). Indexé sur `(conversationId, createdAt)`. |

## Notifications

| Modèle | Table | Rôle |
|---|---|---|
| `Notification` | `notifications` | Notification. `recipientId`, `actorId?` (qui a déclenché), `type`, `entityId?` (objet concerné), `content?`, `read`. Indexée sur `(recipientId, read)`. À la suppression de l'acteur, `actorId` passe à `null` (`SetNull`). |

## Gamification

| Modèle | Table | Rôle |
|---|---|---|
| `Objective` | `objectives` | Objectif personnel. `label`, `progress` (0–100). |
| `Challenge` | `challenges` | Défi communautaire partagé. `name`, `icon?`, `description?`. |
| `UserChallenge` | `user_challenges` | Participation à un défi. Clé composite `(userId, challengeId)`, `progress` (0–100). |

## Règles transverses

- Suppression en cascade (`onDelete: Cascade`) sur les tables de liaison pour
  garder la base cohérente.
- Horodatage : `createdAt` partout ; `updatedAt` sur `User`, `Post`, `Conversation`.
- Les tables sont nommées en `snake_case` via `@@map`, alors que les modèles
  Prisma restent en `PascalCase`.
