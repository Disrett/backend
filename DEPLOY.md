# Déploiement — k3d (environnement de test)

Backend NestJS + PostgreSQL déployé sur un cluster **k3d** (k3s dans Docker).
k3d v5.x requiert **Docker ≥ 20.10.5** et **kubectl**.

## Prérequis

```bash
# Installer k3d (Linux/macOS)
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
# ou : brew install k3d
k3d version
```

## Mise en route (première fois)

```bash
# 1. Registre local (permet de pousser l'image dans le cluster)
make registry

# 2. Création du cluster (Traefik + StorageClass local-path inclus)
make up

# 3. Build + push de l'image de l'API
make build
make push

# 4. Déploiement (Postgres, secrets, API, ingress + migrations Prisma)
make deploy
```

L'API est alors accessible sur **http://localhost:8080/api**
(le port 8080 de l'hôte est mappé sur l'Ingress Traefik dans `k3d-config.yaml`).

```bash
curl http://localhost:8080/api/posts        # => [] au départ
```

## Cycle de développement

Après une modification du code :

```bash
make redeploy     # rebuild + push + rollout restart
make logs         # suivre les logs
```

## Comment ça s'articule

| Élément | Rôle |
|---|---|
| `k3d-config.yaml` | définit le cluster + le port 8080→80 (Ingress) |
| `k8s/11-postgres.yaml` | PostgreSQL en StatefulSet avec volume persistant (`local-path`) |
| `k8s/20-api-secret.yaml` | `DATABASE_URL` (host = `postgres`, le Service) + secrets JWT |
| `k8s/21-api-deployment.yaml` | API + **initContainer** qui lance `prisma migrate deploy` avant le boot |
| `k8s/23-api-ingress.yaml` | Ingress Traefik ; proxifie aussi les WebSockets de la messagerie |

## Points d'attention

- **Secrets** : les valeurs dans `k8s/*-secret.yaml` sont de TEST. Pour autre
  chose qu'un cluster jetable, sortez-les du dépôt (Sealed Secrets, SOPS,
  External Secrets…).
- **Messagerie temps réel** : le déploiement tourne à **1 réplique**. Socket.io
  ne se met à l'échelle horizontalement qu'avec un **adaptateur Redis** +
  sessions persistantes (sticky sessions) — à prévoir avant de monter `replicas`.
- **WebSockets** : aucune config Traefik spéciale n'est nécessaire (support natif).
- **Migrations** : assurées par l'initContainer. Pour un contrôle plus fin,
  vous pouvez les extraire dans un `Job` Kubernetes dédié.
- **Readiness API** : sonde sur `GET /api/posts`. Si vous ajoutez un vrai
  endpoint `/api/health`, pointez la sonde dessus.
