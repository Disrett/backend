# Référence — Variables d'environnement

Le gabarit complet est [`.env.example`](../../.env.example). En cluster, ces
valeurs proviennent des `Secret` Kubernetes (`k8s/20-api-secret.yaml`).

## Base de données

| Variable | Requis | Description |
|---|---|---|
| `DATABASE_URL` | Oui | Chaîne de connexion PostgreSQL, ex. `postgresql://user:password@localhost:5432/sans_limite?schema=public`. En cluster, l'hôte est `postgres` (nom du Service). |

## JWT

| Variable | Requis | Défaut | Description |
|---|---|---|---|
| `JWT_ACCESS_SECRET` | Oui | — | Secret de signature de l'access token. L'API refuse de démarrer sans lui. |
| `JWT_ACCESS_EXPIRES_IN` | Non | `15m` | Durée de vie de l'access token. |
| `JWT_REFRESH_SECRET` | Oui | — | Secret de signature du refresh token (différent de l'access). |
| `JWT_REFRESH_EXPIRES_IN` | Non | `7d` | Durée de vie du refresh token. |

## Serveur

| Variable | Requis | Défaut | Description |
|---|---|---|---|
| `PORT` | Non | `3001` | Port d'écoute HTTP. |
| `NODE_ENV` | Non | — | `production` durcit la politique CORS (voir ci-dessous). |
| `FRONTEND_URL` | Non | `http://localhost:3000` | Origines CORS autorisées, séparées par des virgules. En développement, l'API tolère **en plus** localhost, 127.0.0.1 et les IP de réseau privé sur n'importe quel port. En production, seules les origines listées sont acceptées. |

## Stockage objet (à brancher plus tard)

Commentées dans `.env.example`, prêtes pour un futur module `upload` :
`S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.

## Sécurité

Les valeurs de `.env.example` et des `Secret` Kubernetes du dépôt sont des
valeurs de **test**. Remplace-les pour tout déploiement réel et sors-les du
dépôt (voir [`SECURITY.md`](../../SECURITY.md)).
