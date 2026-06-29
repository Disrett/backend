# ADR-004 : Nix/Lix pour l'environnement reproductible

## Statut

Accepté

## Contexte

L'équipe doit partager exactement le même outillage (Node, Prisma, PostgreSQL,
k3d, kubectl) sans « ça marche chez moi ». Prisma complique les choses : ses
binaires d'engine précompilés ne tournent pas en environnement pur.

## Décision

Nous décrivons l'environnement dans un **flake Nix** (`flake.nix`), évalué
indifféremment avec **Nix** ou **Lix** (fork compatible). Le flake épingle les
versions via `flake.lock` et câble Prisma sur le paquet `prisma-engines` de
nixpkgs au moyen de variables `PRISMA_*`.

## Conséquences

- Positif : environnement identique pour toute l'équipe et en CI.
- Positif : Nix et Lix produisent le même résultat à partir du même `flake.lock`.
- Négatif : un flake ignore les fichiers non suivis par Git — il faut lancer
  `git add -A` avant `nix develop` quand on ajoute un fichier.
- À surveiller : après `nix flake update`, réaligner la version de Prisma.
