# Tutoriel — Prise en main locale

Dans ce tutoriel, nous allons démarrer le backend de bout en bout sur ta machine,
peupler la base avec des données de démonstration, puis créer ta première
publication via l'API. À la fin, tu auras une API qui répond et tu auras vu
passer un parcours complet : inscription, post, like, commentaire.

Ce tutoriel suit **un seul chemin**. Suis chaque étape dans l'ordre, sans dévier.
Les explications du « pourquoi » viennent plus tard, dans la section
[Explications](../explanation/).

## Ce dont tu as besoin

- Nix ou Lix installés (voir [`LIX.md`](../../LIX.md)).
- Docker démarré.

## Étape 1 — Entre dans l'environnement

Place-toi à la racine du backend et ouvre le shell outillé :

```bash
git add -A
nix develop
```

Le `git add -A` est nécessaire : sans lui, un flake ignore les fichiers que tu
viens d'ajouter. Tu vois maintenant un message « Environnement Sans Limites prêt »
avec les versions de Node, Prisma et k3d.

## Étape 2 — Lance une base PostgreSQL

Dans un autre terminal, démarre une base jetable avec Docker :

```bash
docker run --name sl-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sans_limite \
  -p 5432:5432 -d postgres:16
```

## Étape 3 — Configure l'application

Copie le fichier d'exemple et garde ses valeurs par défaut pour ce tutoriel :

```bash
cp .env.example .env
```

Vérifie que `DATABASE_URL` pointe vers la base que tu viens de lancer. La valeur
par défaut (`postgresql://user:password@localhost:5432/...`) correspond au
conteneur de l'étape 2 si tu ajustes l'utilisateur ; remplace `user` par
`postgres` si besoin.

## Étape 4 — Installe et prépare la base

```bash
npm ci
npm run prisma:migrate
npm run prisma:generate
```

La première commande installe les dépendances. La deuxième crée les tables à
partir de `prisma/schema.prisma`. La troisième génère le client Prisma typé.

## Étape 5 — Peuple la base de démonstration

```bash
npm run db:seed
```

Tu obtiens trois comptes de test (mot de passe commun `password123`) :
`marie@sanslimites.fr`, `thomas@sanslimites.fr`, `sophie@sanslimites.fr`, ainsi
que des posts, likes, commentaires et notifications.

## Étape 6 — Démarre l'API

```bash
npm run start:dev
```

Tu vois s'afficher : `🚀 API Sans Limites démarrée sur http://localhost:3001/api`.

Laisse ce terminal ouvert. Dans un autre terminal, vérifie que le fil répond :

```bash
curl http://localhost:3001/api/posts
```

Tu reçois la liste des publications créées par le seed.

## Étape 7 — Crée ta première publication

Inscris-toi pour obtenir un token :

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"toi@exemple.fr","password":"motdepasse123","username":"toi","name":"Toi"}'
```

La réponse contient un `accessToken`. Copie-le, puis crée un post :

```bash
curl -X POST http://localhost:3001/api/posts \
  -H 'Authorization: Bearer COLLE_TON_ACCESS_TOKEN_ICI' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Mon premier post","content":"Bonjour Sans Limites"}'
```

Relance `curl http://localhost:3001/api/posts` : ton post apparaît en tête.

## Étape 8 — Déroule le parcours complet automatiquement

Le script de fumée enchaîne inscription, post, fil, like, commentaire,
notifications et profil :

```bash
BASE_URL=http://localhost:3001/api ./smoke-test.sh
```

Tu vois défiler chaque étape et le message final « ✅ Parcours complet réussi ».

## Et maintenant ?

Tu as un backend qui tourne. Pour la suite :

- Pour **ajouter une fonctionnalité**, va dans [how-to/ajouter-un-module.md](../how-to/ajouter-un-module.md).
- Pour **comprendre l'architecture**, lis [explanation/architecture.md](../explanation/architecture.md).
- Pour **consulter les routes**, ouvre [reference/api-http.md](../reference/api-http.md).
