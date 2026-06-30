# ADR-005 : k3d pour le déploiement de test

## Statut

Accepté

## Contexte

Il faut un environnement de déploiement réaliste (proche de Kubernetes) mais
jetable et exécutable sur un poste de développement, pour valider l'image
Docker, les manifestes, l'Ingress et les migrations.

## Décision

Nous déployons sur **k3d** (k3s dans Docker), piloté par un **Taskfile**. Un
registre local héberge l'image ; Traefik (fourni par k3d) sert d'Ingress et
proxifie nativement les WebSockets. Un **initContainer** synchronise le schéma
Prisma (`prisma db push`) avant le démarrage de l'API.

## Conséquences

- Positif : Kubernetes réaliste en local ; Traefik gère les WebSockets sans config.
- Positif : Task met en cache les étapes (`sources` + `status`) et n'exécute que
  le nécessaire.
- Négatif : `prisma db push` applique le schéma sans fichiers de migration — adapté
  au test, à remplacer par `prisma migrate deploy` en production.
- Négatif : déploiement limité à 1 réplique (voir ADR-006).
