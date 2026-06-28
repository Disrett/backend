# Runbook — Accéder et modifier la base de données (PostgreSQL / k3d)

Ce runbook explique comment se connecter à la base **depuis le terminal**, puis
**ajouter / modifier / supprimer** des éléments, et enfin **où lire les logs**.

> ⚠️ Ce sont des **données de test**. Écrire directement en SQL **contourne les
> validations de l'application** (mots de passe hachés, règles métier…). À
> réserver au debug. Pour des données « propres », préfère l'API ou Prisma Studio.

---

## 0. Les informations clés de ta base

| Élément | Valeur |
|---|---|
| Emplacement | Dans le cluster **k3d**, pod **`postgres-0`**, namespace **`sans-limite`** |
| Image | `postgres:16` |
| Utilisateur | `sl_user` |
| Mot de passe | `sl_password_test` |
| Base | `sans_limite` |
| Tables (Prisma `@@map`) | `users`, `posts`, `comments`, `likes`, `follows`, `notifications`, `messages`, `conversations`, `sports`, `events`, `groups`… (`\dt` donne la liste complète) |

> Toutes les commandes `kubectl` ci-dessous sont à lancer depuis le shell Nix
> (`nix develop`, où `kubectl` est fourni). Le pod `postgres-0` a un nom **stable**
> (StatefulSet) ; le pod de l'API, lui, a un suffixe aléatoire → on l'adresse via
> `deploy/api`.

---

## 1. Deux façons d'accéder à la base

### Méthode A (recommandée) — Prisma Studio, en interface graphique

C'est le plus simple et le plus sûr : Studio gère pour toi les identifiants (`id`),
les dates (`createdAt`/`updatedAt`) et les relations.

```bash
# Terminal 1 — depuis backend/, dans `nix develop` : on expose la base en local
kubectl -n sans-limite port-forward postgres-0 5432:5432

# Terminal 2 — depuis backend/, dans `nix develop` aussi
DATABASE_URL="postgresql://sl_user:sl_password_test@localhost:5432/sans_limite?schema=public" \
  prisma studio
# Ouvre http://localhost:5555
```

Dans l'interface : choisis une table → **Add record** (ajouter), clique une cellule
pour **éditer** (modifier), coche une ligne → **Delete** (supprimer), puis **Save change**.

> Si `prisma studio` se plaint d'un client manquant, passe par la **Méthode B**
> (psql) qui, elle, ne dépend de rien sur l'hôte.

### Méthode B — `psql` en ligne de commande (dans le pod)

Robuste, ne nécessite aucune dépendance sur ta machine (tout est dans le pod) :

```bash
kubectl -n sans-limite exec -it postgres-0 -- psql -U sl_user -d sans_limite
# Si un mot de passe est demandé : sl_password_test
```

Tu obtiens l'invite `sans_limite=#`. Pour une commande unique sans entrer en interactif :

```bash
kubectl -n sans-limite exec -it postgres-0 -- psql -U sl_user -d sans_limite -c '\dt'
```

---

## 2. Explorer la base (avant de modifier)

Dans l'invite `psql` :

```sql
\dt                       -- liste toutes les tables
\d posts                  -- montre les colonnes EXACTES de la table posts
SELECT * FROM posts LIMIT 5;
SELECT id, username, name FROM users;
\q                        -- quitter
```

> 💡 **Réflexe clé** : `\d <table>` t'affiche les **vrais noms de colonnes**. C'est
> important car le nommage est mélangé (voir l'encadré ci-dessous).

### ⚠️ Règles de nommage (sinon le SQL plante)

- **Tables** : en minuscules (`users`, `posts`, `comments`…) → **pas** de guillemets.
- **Colonnes** : souvent en **camelCase** (`authorId`, `imageUrl`, `createdAt`,
  `updatedAt`, `postId`…) → **guillemets doubles obligatoires** : `"authorId"`.
  Exception : dans la table `users`, ce sont `created_at` et `updated_at`
  (snake_case, sans guillemets).
- **`id`** n'a **pas** de valeur automatique → tu dois en fournir une à l'insertion
  (ex. `gen_random_uuid()::text`).
- **`createdAt`** a une valeur par défaut (`now()`) → tu peux l'omettre.
- **`updatedAt`** (table `posts`) n'a **pas** de défaut → mets `now()` à l'insertion.

---

## 3. AJOUTER un élément (`INSERT`)

### Ajouter une publication (`posts`)

```sql
INSERT INTO posts (id, "authorId", title, content, "updatedAt")
VALUES (
  gen_random_uuid()::text,                                   -- id unique
  (SELECT id FROM users WHERE username = 'alex.martin'),     -- auteur existant
  'Mon titre',
  'Mon contenu',
  now()                                                      -- updatedAt obligatoire
);
```

### Ajouter un commentaire (`comments`)

```sql
INSERT INTO comments (id, "postId", "authorId", content)
VALUES (
  gen_random_uuid()::text,
  (SELECT id FROM posts ORDER BY "createdAt" DESC LIMIT 1),  -- le post le plus récent
  (SELECT id FROM users WHERE username = 'alex.martin'),
  'Bravo pour cette perf !'
);
-- createdAt est omis : sa valeur par défaut now() s'applique
```

> Les sous-requêtes `(SELECT id FROM …)` évitent de copier-coller des `id` à la
> main et **respectent les clés étrangères** (un post doit pointer vers un user qui
> existe, sinon l'insert est refusé).

---

## 4. MODIFIER un élément (`UPDATE`)

```sql
-- Modifier le titre d'un post précis (pense à rafraîchir updatedAt)
UPDATE posts
SET title = 'Titre corrigé', "updatedAt" = now()
WHERE id = 'colle-ici-un-id-de-post';

-- Modifier le nom affiché d'un utilisateur
UPDATE users
SET name = 'Alex Martin', updated_at = now()   -- snake_case pour la table users
WHERE username = 'alex.martin';
```

> ⚠️ **Toujours** mettre une clause `WHERE`. Sans elle, l'`UPDATE` modifie **toutes
> les lignes** de la table.

---

## 5. SUPPRIMER un élément (`DELETE`)

```sql
-- Supprimer un commentaire précis
DELETE FROM comments WHERE id = 'colle-ici-un-id-de-commentaire';

-- Supprimer un post : ses likes et commentaires partent AUSSI (suppression en cascade)
DELETE FROM posts WHERE id = 'colle-ici-un-id-de-post';

-- Supprimer un utilisateur : ses posts, commentaires, likes, etc. partent en cascade
DELETE FROM users WHERE username = 'compte.a.supprimer';
```

> Les suppressions « en cascade » (`onDelete: Cascade`) sont définies dans le schéma
> Prisma : supprimer un `post` retire ses `likes`/`comments` ; supprimer un `user`
> retire tout son contenu. Là encore, **jamais de `DELETE` sans `WHERE`**.

---

## 6. Où sont les logs de la base de données

Dans Kubernetes, PostgreSQL n'écrit **pas** dans un fichier de log classique : il
écrit sur la **sortie standard du conteneur**, que tu lis avec `kubectl logs`.
C'est ça, « le fichier de logs » de ta base.

```bash
# Logs actuels de la base
kubectl -n sans-limite logs postgres-0

# En direct (suivi continu, Ctrl+C pour quitter)
kubectl -n sans-limite logs -f postgres-0

# Les 100 dernières lignes
kubectl -n sans-limite logs --tail=100 postgres-0

# Logs du conteneur PRÉCÉDENT (utile après un crash / redémarrage)
kubectl -n sans-limite logs --previous postgres-0
```

> 🔎 **Et un vrai fichier sur le disque ?** Par défaut l'image `postgres:16` n'active
> pas le « logging collector », donc il n'y a pas de `*.log` dans le dossier de
> données (`/var/lib/postgresql/data/pgdata`). Si tu y tiens, les logs bruts du
> conteneur sont stockés par k3d sur le nœud, sous
> `/var/log/pods/sans-limite_postgres-0_*/postgres/*.log` — mais il faut entrer dans
> le conteneur du nœud k3d pour les voir. En pratique, **`kubectl logs` est la bonne
> méthode**.

**Bonus — logs de l'API** (NestJS), si besoin de corréler :
```bash
kubectl -n sans-limite logs -f deploy/api
```

---

## 7. Aide-mémoire express

| Action | Commande |
|---|---|
| Ouvrir psql | `kubectl -n sans-limite exec -it postgres-0 -- psql -U sl_user -d sans_limite` |
| Lister les tables | `\dt` |
| Voir les colonnes d'une table | `\d posts` |
| Lire | `SELECT * FROM posts LIMIT 5;` |
| Ajouter | `INSERT INTO posts (id, "authorId", title, content, "updatedAt") VALUES (…);` |
| Modifier | `UPDATE posts SET title = '…', "updatedAt" = now() WHERE id = '…';` |
| Supprimer | `DELETE FROM posts WHERE id = '…';` |
| Quitter psql | `\q` |
| Logs de la base | `kubectl -n sans-limite logs -f postgres-0` |
| Interface graphique | `port-forward postgres-0 5432:5432` + `prisma studio` |

> Rappels de sécurité : `WHERE` obligatoire sur tout `UPDATE`/`DELETE` ; les écritures
> SQL directes sont pour le test/debug ; pour créer un **utilisateur** utilisable par
> l'app, passe par l'inscription (le mot de passe doit être haché), pas par un `INSERT`.
