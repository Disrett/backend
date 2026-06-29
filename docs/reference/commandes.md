# Référence — Commandes

## Scripts npm (package.json)

| Commande | Effet |
|---|---|
| `npm run start:dev` | Démarre l'API en watch (`nest start --watch`) sur le port 3001. |
| `npm run start` | Démarre l'API sans watch. |
| `npm run start:prod` | Démarre la version compilée (`node dist/main`). |
| `npm run build` | Compile le TypeScript (`nest build`) vers `dist/`. |
| `npm run lint` | ESLint avec `--fix` sur `{src,test}/**/*.ts`. |
| `npm run prisma:generate` | Régénère le client Prisma typé. |
| `npm run prisma:migrate` | Crée et applique une migration (`prisma migrate dev`). |
| `npm run prisma:studio` | Ouvre l'inspecteur web de la base. |
| `npm run db:seed` | Peuple la base avec les données de démonstration. |

## Tâches Task (Taskfile.yml) — déploiement k3d

| Commande | Effet |
|---|---|
| `task` | Liste les tâches disponibles. |
| `task registry` | Crée le registre local k3d (idempotent). |
| `task up` | Crée le cluster k3d (idempotent). Dépend de `registry`. |
| `task build` | Construit l'image Docker de l'API (skippée si rien n'a changé). |
| `task push` | Pousse l'image dans le registre local. Dépend de `build`. |
| `task deploy` | Applique les manifestes `k8s/` et attend le rollout. |
| `task redeploy` | Cycle de dev : rebuild + push + rollout restart. |
| `task logs` | Affiche les logs de l'API en direct. |
| `task down` | Supprime le cluster (le registre survit). |

Le `Makefile` fournit les mêmes cibles pour qui préfère `make`, mais sans le
cache de Task (`sources`/`status`).

## Scripts du dépôt

| Commande | Effet |
|---|---|
| `./smoke-test.sh` | Parcours de bout en bout de l'API (curl + jq). Variable `BASE_URL` pour cibler local ou cluster. |

## Environnement

| Commande | Effet |
|---|---|
| `nix develop` | Entre dans le devShell outillé (penser à `git add -A` avant). |
| `direnv allow` | Active le devShell automatiquement via `.envrc`. |
| `nix flake update` | Met à jour les paquets épinglés (réaligner Prisma ensuite). |
