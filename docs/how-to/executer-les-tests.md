# Exécuter les tests et le smoke-test

Ce guide montre comment valider l'API : vérifications statiques, parcours de bout
en bout, et requêtes manuelles.

## Vérifications statiques

```bash
npm run build    # compile le TypeScript via nest build
npm run lint     # ESLint avec --fix
```

Ces deux commandes font partie de la Définition de « Terminé ».

## Smoke-test de bout en bout

Le script `smoke-test.sh` déroule un parcours complet : inscription, création de
post, fil, like, commentaire, notifications, profil. Il requiert `curl` et `jq`
(tous deux fournis par le devShell).

Contre une API locale :

```bash
BASE_URL=http://localhost:3001/api ./smoke-test.sh
```

Contre le cluster k3d (valeur par défaut du script) :

```bash
./smoke-test.sh
```

Le script s'arrête à la première erreur (`set -euo pipefail`) et affiche
« ✅ Parcours complet réussi » s'il va au bout.

## Requêtes manuelles

Le fichier `requests.http` contient une séquence prête à l'emploi, exécutable
depuis un éditeur compatible (extension REST Client). Il capture automatiquement
le token et l'identifiant de post entre les requêtes.

## Pas de tests unitaires pour l'instant

Le dépôt ne contient pas encore de suite de tests unitaires NestJS. Quand tu en
ajoutes, place-les à côté du code (`*.spec.ts`) et complète la Définition de
« Terminé » dans [`AGENTS.md`](../../AGENTS.md) et le gabarit de PR.
