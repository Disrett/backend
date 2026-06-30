# Contribuer à Sans Limites — Backend

Merci de contribuer. Ce guide explique comment configurer l'environnement, quelles conventions suivre, et comment soumettre une modification.

## Prérequis

- Nix ou Lix (voir [`LIX.md`](./LIX.md)) — fournit Node.js 22, Prisma, PostgreSQL, k3d, kubectl.
- Docker (le démon doit tourner pour k3d et le build de l'image).
- direnv (optionnel) — active le devShell automatiquement.

Sans Nix, installe au minimum Node.js 22 et un PostgreSQL 16 local.

## Mise en route

1. Clone le dépôt.
2. Entre dans l'environnement : `nix develop` (ou `direnv allow`).
3. Copie la configuration : `cp .env.example .env`, puis renseigne `DATABASE_URL` et les secrets JWT.
4. Installe les dépendances : `npm ci`.
5. Crée la base : `npm run prisma:migrate`, puis `npm run prisma:generate`.
6. Peuple la base de démonstration : `npm run db:seed`.
7. Lance l'API : `npm run start:dev` (sur `http://localhost:3001/api`).

Le tutoriel pas à pas se trouve dans [`docs/tutorials/01-prise-en-main-locale.md`](./docs/tutorials/01-prise-en-main-locale.md).

## Conventions

- **Messages de commit** : [Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): description`. Types courants : `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- **Branches** : `feat/<sujet>`, `fix/<sujet>`, `docs/<sujet>`, à partir de `main`.
- **Style de code** : ESLint applique le format. Lance `npm run lint` avant de commiter.
- **Modules** : suis le patron de `src/posts/`. Détail dans [`docs/how-to/ajouter-un-module.md`](./docs/how-to/ajouter-un-module.md).
- **Validation** : toute entrée HTTP passe par un DTO `class-validator`.
- **Documentation** : traite la documentation comme du code. Une modification de comportement (route, champ, variable d'environnement) s'accompagne d'une mise à jour de la référence concernée et du `CHANGELOG.md`.

## Soumettre une modification

1. Crée une branche depuis `main`.
2. Apporte tes changements.
3. Vérifie localement que la **Définition de « Terminé »** passe :
   - `npm run build` compile ;
   - `npm run lint` ne signale rien ;
   - `npx prisma validate` accepte le schéma (si tu y as touché) ;
   - `./smoke-test.sh` réussit (API démarrée).
4. Mets à jour le `CHANGELOG.md` (section « Non publié »).
5. Ouvre une pull request en suivant le gabarit.

La CI (voir `.github/workflows/ci.yml`) valide le flake Nix et le build de l'API à chaque PR.

## À éviter

- Stocker une image en base (utilise une `imageUrl` vers un stockage objet).
- Committer un secret réel (les valeurs du dépôt sont de TEST).
- Monter `replicas > 1` sans adaptateur Redis Socket.io.
- Désactiver le `ValidationPipe` global ou contourner les guards d'authentification.
- Mélanger plusieurs sujets dans une seule PR.
