# Explication — Environnement reproductible

Ce document explique pourquoi le projet s'appuie sur Nix/Lix et k3d, et quels
pièges ces choix évitent ou créent.

## Le problème du « ça marche chez moi »

Un backend a besoin d'un outillage précis : une version de Node, la bonne CLI
Prisma, un PostgreSQL, k3d, kubectl. Si chaque développeur installe ces outils à
la main, les versions divergent et des bugs surgissent qui ne se reproduisent que
sur certaines machines. La CI, elle aussi, doit utiliser exactement le même
outillage que les développeurs.

## Pourquoi Nix (et Lix)

Le `flake.nix` décrit l'environnement de façon déclarative et **épingle** les
versions dans `flake.lock`. Quiconque entre dans le devShell obtient le même
outillage, au même niveau, que ses coéquipiers et que la CI.

**Lix** est un fork de Nix, compatible avec les flakes et nixpkgs. Le même
`flake.lock` produit le même environnement sous Nix comme sous Lix : l'équipe
peut mélanger les deux sans friction. Lix sert l'environnement hôte ; il ne
construit pas l'image Docker.

## Le piège Prisma

Les binaires d'engine de Prisma sont précompilés pour des environnements
« classiques » et ne tournent pas tels quels dans un environnement Nix pur. Le
flake résout cela en câblant Prisma sur le paquet `prisma-engines` de nixpkgs,
via des variables `PRISMA_*` posées par le `shellHook`. C'est invisible à
l'usage, mais c'est la raison pour laquelle une erreur d'engine signifie presque
toujours « tu n'es pas dans le devShell ».

Un point de vigilance subsiste : la version de la CLI `prisma` doit correspondre
à `@prisma/client`. Le shellHook l'affiche au démarrage pour qu'on le vérifie.

## Le piège du flake et de Git

Un flake n'évalue que les fichiers **suivis par Git**. Ajouter un fichier sans
le `git add` le rend invisible dans le shell, ce qui produit des erreurs
déroutantes. D'où la consigne : `git add -A` avant `nix develop`.

## Pourquoi k3d pour le déploiement de test

k3d fait tourner k3s (un Kubernetes léger) dans Docker. On obtient un
environnement très proche d'un vrai cluster — Ingress Traefik, StatefulSet,
secrets, sondes de disponibilité — tout en restant jetable et exécutable sur un
poste. Cela permet de valider l'image, les manifestes et les migrations avant un
déploiement réel.

Le schéma de base est synchronisé par un initContainer (`prisma db push`) au
démarrage : pratique en test, à remplacer par de vraies migrations
(`prisma migrate deploy`) en production. Ce choix est tracé dans
[ADR-005](../adr/005-k3d-deploiement-test.md).

## Reproductibilité d'équipe

- Committer `flake.lock` garantit des versions identiques pour tous.
- `nix flake update` met à jour les paquets ; il faut alors réaligner Prisma.
- La CI teste le flake via l'installateur Lix, donc l'environnement décrit ici
  est vérifié à chaque PR.
