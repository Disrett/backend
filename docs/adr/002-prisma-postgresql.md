# ADR-002 : Prisma + PostgreSQL pour la persistance

## Statut

Accepté

## Contexte

Le modèle de données est riche et relationnel : utilisateurs, graphe d'abonnements,
posts, likes, commentaires, groupes, événements, messagerie, notifications,
gamification. Il faut des relations fiables, des contraintes d'unicité, un typage
fort côté application et des migrations versionnées.

## Décision

Nous utilisons **PostgreSQL 16** comme base, et **Prisma 6** comme ORM et outil
de migration. `schema.prisma` est la source de vérité du modèle.

## Conséquences

- Positif : client typé généré, migrations reproductibles, contraintes d'unicité
  déclaratives (`@@unique`) qui rendent les likes et abonnements idempotents.
- Positif : `onDelete: Cascade` sur les tables de liaison garde la base cohérente.
- Négatif : les binaires d'engine Prisma exigent un câblage particulier sous Nix
  (voir ADR-004 et `LIX.md`).
- À surveiller : la version de la CLI `prisma` doit correspondre à `@prisma/client`.
