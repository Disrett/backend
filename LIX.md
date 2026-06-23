# Tester Sans Limites avec Lix

**Lix** est un fork du gestionnaire Nix, axé sur la correction et l'ergonomie.
Il est **compatible flakes et nixpkgs** : le `flake.nix` du projet est identique
à ce qu'il serait sous Nix — on l'utilise simplement avec la commande `nix`
fournie par Lix. Lix sert ici à l'environnement **hôte** (Node, Prisma, k3d,
kubectl, PostgreSQL) ; il ne construit pas l'image Docker.

## Installation de Lix (une fois)

Sur Linux et macOS (à lancer en utilisateur non-root) :

```bash
curl --proto '=https' --tlsv1.2 -sSf -L https://install.lix.systems/lix | sh -s -- install
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
```

L'installateur active les *flakes* par défaut — rien d'autre à configurer.
Si vous aviez déjà une installation Nix, suivez la page d'install de Lix
(https://lix.systems/install/) pour migrer plutôt que réinstaller par-dessus.

Vérifiez :
```bash
nix --version      # doit mentionner "Lix"
```

## Entrer dans l'environnement

Exactement comme avec Nix (c'est le même format de flake) :

```bash
git add * # sinon ca casse les couilles
nix develop          # shell avec tout l'outillage épinglé
```

Ou avec direnv :
```bash
direnv allow         # lit le .envrc fourni (n'active rien si Lix/Nix absent)
```

## ⚠ Le point Prisma (inchangé par rapport à Nix)

Les binaires Prisma précompilés ne tournent pas en environnement pur : le flake
câble Prisma sur le paquet `prisma-engines` de nixpkgs via des variables
d'environnement (déjà fait). À l'entrée du shell, vérifiez que la version de
`prisma` affichée correspond à `@prisma/client` du `package.json` ; sinon,
alignez l'un sur l'autre ou utilisez nix-prisma-utils
(https://github.com/VanCoding/nix-prisma-utils).

## Workflow de test complet

### 1. L'API en local (sans Kubernetes) SANS LIX DEPRECIE
**NON PAS CA**
```bash
nix develop
initdb -D .pgdata
pg_ctl -D .pgdata -o "-k /tmp" -l .pgdata/log start
createdb -h /tmp sans_limite

cp .env.example .env   # ajuster DATABASE_URL si besoin
npm ci
npx prisma migrate dev
npm run start:dev      # http://localhost:3001/api
```

### 2. Le déploiement k3d (docker, k3d, kubectl déjà dans le shell)
**OUI CA**
```bash
nix develop
make registry
make up
make build && make push
make deploy
curl http://localhost:8080/api/posts  # ca doit rien renvoyer
./smoke-test.sh # test le backend
```

## Reproductibilité & équipe

- Committez `flake.lock` : versions identiques pour tout le monde, sous Lix
  comme sous Nix.
- `nix flake update` met à jour les paquets (puis réalignez Prisma si besoin).
- Les coéquipiers peuvent rester sous Nix classique : le même `flake.lock`
  produit le même environnement, les deux implémentations étant compatibles.
- CI : le flake est testé automatiquement via l'installateur Lix
  (voir `.github/workflows/ci.yml`).
