# Gérer les migrations Prisma

Ce guide montre comment faire évoluer le schéma de la base en local, et comment
le schéma est synchronisé en cluster.

## Modifier le schéma

Édite `prisma/schema.prisma` (ajout d'un modèle, d'un champ, d'un index...).
Valide la syntaxe :

```bash
npx prisma validate
```

## Créer une migration en local

Génère et applique la migration, puis régénère le client typé :

```bash
npm run prisma:migrate    # prisma migrate dev — demande un nom de migration
npm run prisma:generate
```

Prisma crée un dossier horodaté sous `prisma/migrations/` contenant le SQL.
Committe ce dossier : il fait partie de l'historique versionné du schéma.

## Inspecter la base

Pour explorer les données dans le navigateur :

```bash
npm run prisma:studio
```

## Synchronisation en cluster k3d

En cluster, le schéma est synchronisé automatiquement par un **initContainer**
qui exécute `prisma db push --skip-generate` avant le démarrage de l'API (voir
`k8s/21-api-deployment.yaml`). `db push` applique l'état du schéma **sans**
fichiers de migration — pratique pour un environnement de test jetable.

## Passer en mode production

Pour un environnement durable, remplace `db push` par de vraies migrations :

1. Génère les migrations en local avec `prisma migrate dev`.
2. Dans le déploiement, remplace la commande de l'initContainer par
   `npx prisma migrate deploy`.
3. Committe systématiquement le dossier `prisma/migrations/`.

## Pièges

- Une erreur d'engine Prisma en local signifie souvent que tu es hors du devShell
  Nix. Relance `nix develop`.
- Après `nix flake update`, vérifie que `prisma --version` correspond toujours à
  `@prisma/client` du `package.json`.
