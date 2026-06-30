# Journal des modifications

Toutes les modifications notables de ce backend sont consignées ici.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et le projet respecte le [versionnage sémantique](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté

- Système de documentation complet : `AGENTS.md`, `CLAUDE.md`, structure Diátaxis
  (`docs/tutorials`, `docs/how-to`, `docs/reference`, `docs/explanation`),
  registres de décision (`docs/adr`), fichiers de normes communautaires
  (`CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, `CHANGELOG`, `LICENSE`).

## [0.1.0] — 2026-06-28

### Ajouté

- Module **auth** : inscription, connexion, déconnexion, renouvellement de tokens
  (JWT access + refresh, hachage argon2, rotation du refresh token).
- Module **users** : profil public par `username`, suivre / ne plus suivre.
- Module **posts** : fil d'actualité paginé par curseur, création, suppression,
  like idempotent, commentaires. Sert de module de référence.
- Module **messaging** : messagerie temps réel via WebSocket (Socket.io) —
  rejoindre une conversation, envoyer un message, accusé de lecture, indicateur
  de saisie ; persistance des messages.
- Module **notifications** : liste, marquage « tout lu », suppression.
- Schéma Prisma complet (utilisateurs, abonnements, sports, posts, likes,
  commentaires, groupes, événements, messagerie, notifications, défis, objectifs).
- Outillage : environnement Nix/Lix (`flake.nix`), déploiement k3d via `Taskfile.yml`,
  image Docker multi-étapes, manifestes Kubernetes, CI GitHub Actions (Lix),
  spécification `openapi.yaml`, script `smoke-test.sh`, seed de démonstration.

[Non publié]: https://example.com/sans-limites/backend/compare/v0.1.0...HEAD
[0.1.0]: https://example.com/sans-limites/backend/releases/tag/v0.1.0
