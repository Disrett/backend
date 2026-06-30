# Registres de décision d'architecture (ADR)

Un ADR capture **une** décision d'architecture : son contexte, la décision prise,
et ses conséquences. Les ADR répondent à la question « pourquoi est-ce fait ainsi ? »
et empêchent de rouvrir des débats déjà tranchés.

## Convention

- Un fichier par décision, numéroté : `NNN-titre-court.md`.
- Statut : `Proposé`, `Accepté`, `Déprécié` ou `Remplacé par ADR-XXX`.
- Une décision actée n'est pas réécrite : pour revenir dessus, on crée un nouvel ADR
  qui remplace l'ancien.
- Modèle de départ : [`000-template.md`](./000-template.md).

## Index

| ADR | Titre | Statut |
|---|---|---|
| [001](./001-nestjs-comme-framework.md) | NestJS comme framework applicatif | Accepté |
| [002](./002-prisma-postgresql.md) | Prisma + PostgreSQL pour la persistance | Accepté |
| [003](./003-auth-jwt-argon2.md) | Authentification JWT access+refresh + argon2 | Accepté |
| [004](./004-nix-lix-environnement.md) | Nix/Lix pour l'environnement reproductible | Accepté |
| [005](./005-k3d-deploiement-test.md) | k3d pour le déploiement de test | Accepté |
| [006](./006-socketio-temps-reel.md) | Socket.io pour la messagerie temps réel | Accepté |
| [007](./007-cuid-identifiants.md) | cuid() pour les identifiants | Accepté |
| [008](./008-images-url-stockage-objet.md) | Images stockées par URL, hors base | Accepté |
