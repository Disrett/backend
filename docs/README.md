# Documentation du backend Sans Limites

Cette documentation suit le cadre **Diátaxis** : chaque document sert **un seul**
besoin du lecteur, jamais plusieurs à la fois. Avant d'écrire ou de chercher,
identifie ton besoin avec ce tableau.

|  | Apprendre | Travailler |
|---|---|---|
| **Agir** | [Tutoriels](./tutorials/) — apprendre en faisant | [Guides pratiques](./how-to/) — atteindre un objectif précis |
| **Comprendre** | [Explications](./explanation/) — saisir le pourquoi | [Référence](./reference/) — vérifier un fait pendant le travail |

## Par où commencer

- **Tu découvres le projet ?** Suis le tutoriel [Prise en main locale](./tutorials/01-prise-en-main-locale.md).
- **Tu as une tâche précise ?** Va dans [how-to/](./how-to/) (ajouter un module, protéger une route, gérer une migration, lancer les tests).
- **Tu cherches un fait exact ?** Va dans [reference/](./reference/) (routes HTTP, modèle de données, variables d'environnement, commandes, événements WebSocket).
- **Tu veux comprendre un choix de conception ?** Lis [explanation/](./explanation/) et les [registres de décision](./adr/).

## Contenu

### Tutoriels (apprentissage par la pratique)

- [01 — Prise en main locale](./tutorials/01-prise-en-main-locale.md)

### Guides pratiques (pour atteindre un objectif)

- [Ajouter un nouveau module](./how-to/ajouter-un-module.md)
- [Protéger une route et récupérer l'utilisateur connecté](./how-to/proteger-une-route.md)
- [Gérer les migrations Prisma](./how-to/gerer-les-migrations-prisma.md)
- [Exécuter les tests et le smoke-test](./how-to/executer-les-tests.md)

### Référence (faits à consulter)

- [API HTTP](./reference/api-http.md)
- [Modèle de données](./reference/modele-de-donnees.md)
- [Variables d'environnement](./reference/variables-environnement.md)
- [Commandes (npm + Task)](./reference/commandes.md)
- [Événements WebSocket](./reference/evenements-websocket.md)

### Explications (comprendre les concepts)

- [Architecture générale](./explanation/architecture.md)
- [Authentification : JWT, refresh et argon2](./explanation/authentification.md)
- [Messagerie temps réel](./explanation/messagerie-temps-reel.md)
- [Environnement reproductible (Nix/Lix + k3d)](./explanation/environnement-reproductible.md)

### Registres de décision d'architecture (ADR)

Le journal des décisions techniques se trouve dans [adr/](./adr/). Il répond à la
question « pourquoi a-t-on fait ce choix ? » et évite de rouvrir des débats tranchés.

## Documents transverses (racine du backend)

- [`README.md`](../README.md) — première impression, démarrage rapide.
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — comment contribuer.
- [`DEPLOY.md`](../DEPLOY.md) — déploiement k3d détaillé.
- [`LIX.md`](../LIX.md) — environnement Nix/Lix.
- [`openapi.yaml`](../openapi.yaml) — contrat d'API formel.
- [`AGENTS.md`](../AGENTS.md) — instructions pour les agents IA.

## Maintenir cette documentation

Traite la documentation comme du code : versionnée dans Git, revue en pull request,
élaguée quand une règle ne s'applique plus. Une information obsolète nuit davantage
que son absence. Quand tu modifies un comportement, mets à jour la **référence**
correspondante dans la même PR.
