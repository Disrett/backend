# 🔗 Intégration Frontend ↔ Backend — Sans Limites

Ce document décrit **toutes les étapes** réalisées pour relier les deux parties du
projet, jusqu'ici totalement indépendantes :

- **`frontend/`** — application Next.js / React (l'interface, qui n'utilisait que
  des données « mock » codées en dur, sans aucun appel réseau) ;
- **`backend/`** — API NestJS / Prisma / PostgreSQL (authentification, posts,
  utilisateurs, notifications, messagerie temps réel).

> **Objectif respecté :** relier les deux **sans casser** l'existant. Si le
> backend n'est pas démarré, le frontend continue de fonctionner en *mode
> démonstration* (données d'exemple). Aucun composant d'affichage n'a été cassé.

---

## 1. Diagnostic initial

| Constat | Détail |
|---|---|
| Aucun appel réseau dans le front | `grep` sur `fetch / axios / localStorage / socket` → **0 résultat** : tout était mocké. |
| Contrat d'API du back | Routes sous **`http://localhost:3001/api`**, auth par **JWT Bearer** (access + refresh). |
| CORS déjà prêt côté back | `main.ts` autorise déjà `http://localhost:3000` (le front). **Aucune modification nécessaire.** |
| Script de seed manquant | `package.json` (back) référence `prisma/seed.ts` mais le fichier **était absent**. |
| Formulaires non câblés | `login` et `signup` faisaient seulement un `console.log`. |

---

## 2. Architecture choisie

Pour relier proprement et sans risque, j'ai introduit une **couche d'intégration**
côté frontend plutôt que de modifier les composants d'affichage :

```
frontend/app/lib/
├── auth.js       # stockage des jetons JWT (localStorage)
├── api.js        # client API unique → toutes les routes du backend
└── mappers.js    # convertit les formes "backend" → formes attendues par l'UI
```

**Pourquoi des mappers ?** Les composants (`PostCard`, `NotificationItem`…)
attendaient des objets d'une forme précise (ex. `post.authorImage`, `post.timeAgo`).
Le backend renvoie une forme différente (`author.avatarUrl`, `createdAt`…). Les
mappers traduisent l'un vers l'autre → **aucun composant de présentation n'a dû
être réécrit**, ce qui réduit fortement le risque de régression visuelle.

**Repli (fallback) :** chaque page tente de charger les vraies données ; en cas
d'échec (backend éteint), elle conserve les données de démo déjà affichées. Un
bandeau « Mode démonstration » prévient l'utilisateur.

---

## 3. Comment lancer le projet complet

> **Important — le backend DOIT être lancé via Nix.** L'outillage (node, task,
> k3d, kubectl, prisma…) est fourni par le *dev shell* Nix (Lix), et les
> dépendances npm du backend sont installées **dans l'image Docker** lors du
> `task build` — il ne faut donc **PAS** faire de `npm install` côté backend.
> Le backend tourne dans un cluster **k3d** (k3s dans Docker) et est exposé sur
> **http://localhost:8080/api** (et non 3001).

### Prérequis
- **Docker** (démon démarré) — k3d crée un k3s *dans* Docker.
- **Nix / Lix** — pour `nix develop` (fournit node 22, go-task, k3d, kubectl, prisma + engines). Voir `backend/LIX.md`.
- **Node.js ≥ 18 + npm** — uniquement pour le **frontend**.

### 3.1 Backend — via Nix + Task + k3d (terminal 1)

```bash
cd backend

nix develop
#  Ouvre le shell de développement reproductible (Lix lit flake.nix / flake.lock).
#  Met à disposition l'outillage épinglé : node 22, go-task, k3d, kubectl, prisma + engines.
#  ⚠️ AUCUN `npm install` à lancer ici : les deps backend sont installées dans l'image (cf. task build).

task registry
#  Crée le registre d'images Docker local utilisé par k3d (k3d-sl-registry:5000).
#  Idempotent : si le registre existe déjà, la tâche est ignorée (mécanisme `status` du Taskfile).

task up
#  Crée le cluster k3d « sans-limite » (1 serveur + 1 agent, Traefik inclus).
#  Mappe le port 8080 de l'hôte sur l'Ingress du cluster (cf. k3d-config.yaml). Idempotent.

task build
#  Construit l'image Docker de l'API (Dockerfile multi-étapes).
#  👉 C'EST ICI que tout s'installe et se compile : `npm ci` + `npx prisma generate` + `npm run build`.
#     D'où l'inutilité d'un `npm install` sur l'hôte. (Re-build seulement si le code a changé : mécanisme `sources`.)

task push
#  Pousse l'image construite dans le registre local k3d (dépend de `build`, qui est donc garanti à jour).

task deploy
#  Applique les manifestes k8s (dossier k8s/) : namespace, PostgreSQL, secrets, API, Service, Ingress.
#  Un initContainer exécute `npx prisma db push` (synchronise le schéma vers la base) AVANT le démarrage de l'API,
#  puis la commande attend la fin du rollout. → API prête sur http://localhost:8080/api.
```

Vérification rapide :
```bash
curl http://localhost:8080/api/posts        # => [] tant que la base n'est pas seedée
```

**Données de démo + comptes de test** (le seed n'est **pas** automatique). On le lance
**dans le pod**, qui contient déjà `node_modules` (donc toujours sans `npm install` sur l'hôte) :
```bash
kubectl -n sans-limite exec deploy/api -- npm run db:seed
#  Exécute `ts-node prisma/seed.ts` à l'intérieur du conteneur de l'API :
#  crée les comptes de test + publications + likes + commentaires + notifications.
```

**Cycle de développement** (après une modif du code backend — ex. le correctif CORS de `main.ts`) :
```bash
task redeploy        # rebuild + push + redémarrage du déploiement (applique le nouveau code dans le cluster)
task logs            # suit en direct les logs de l'API
```

> 🔸 **CORS en mode déployé.** L'image tourne avec `NODE_ENV=production`, donc la
> tolérance « réseau local » du CORS (ajoutée dans `main.ts`) est **désactivée** :
> accédez au front via `http://localhost:3000`, ou ajustez `FRONTEND_URL` dans
> `k8s/20-api-secret.yaml` puis `task redeploy`.

### 3.2 Frontend — via npm (terminal 2)

```bash
cd frontend

npm install
#  Côté FRONTEND, `npm install` EST nécessaire (contrairement au backend géré par Nix/Docker).

npm run dev
#  Démarre Next.js en mode développement → interface sur http://localhost:3000.
```

> ⚠️ **Faire pointer le front vers le bon port.** Avec le backend Nix/Task/k3d,
> l'API est sur **8080**. Mettez donc dans `frontend/.env.local` :
> ```
> NEXT_PUBLIC_API_URL=http://localhost:8080/api
> NEXT_PUBLIC_WS_URL=http://localhost:8080
> ```
> puis **relancez** `npm run dev` (Next.js ne lit `NEXT_PUBLIC_*` qu'au démarrage).
> Avec ce port, le smoke-test (section 6.2.A) tourne d'ailleurs **sans** le
> préfixe `BASE_URL` (sa valeur par défaut est déjà 8080).

### Comptes de test (créés par le seed)
Mot de passe commun : **`password123`**
- `marie@sanslimites.fr`
- `thomas@sanslimites.fr`
- `sophie@sanslimites.fr`

> 🔹 **Note honnête sur le port.** Pendant tout notre débogage, nous avons utilisé
> le chemin « tout local » `npm run start:dev` (port **3001**), plus simple pour
> itérer. Il reste possible *dans le dev shell Nix* (node y est fourni), mais il
> exige une base PostgreSQL séparée **et** des `node_modules` sur l'hôte — ce que
> votre équipe évite. Le chemin **Nix + Task + k3d ci-dessus (port 8080) est le
> chemin de référence du projet** ; c'est celui à privilégier.

> 🧪 **Statut de validation de cette section.** Le flux Nix/Task/k3d n'a **pas pu
> être exécuté de bout en bout** dans l'environnement de test (ni Nix, ni démon
> Docker, ni accès au cache binaire Nix / au binaire `task`). Il a été **reconstitué
> à partir des fichiers du projet** (`flake.nix`, `Taskfile.yml`, `Dockerfile`,
> `k8s/`, `DEPLOY.md`), et tous les manifestes YAML ont été validés. À exécuter
> sur un poste disposant de Nix + Docker pour confirmation finale.

---

## 4. Validation effectuée

### 4.1 Validation côté intégration (réalisée lors de la mise en place)

| Vérification | Résultat |
|---|---|
| `npm install` (frontend) | ✅ 360 paquets installés sans erreur. |
| `npm run build` (frontend) | ✅ **Compilation réussie**, 19 pages générées (dont `/`, `/login`, `/signup`, `/notifications`). |
| Cohérence `seed.ts` ↔ `schema.prisma` | ✅ Tous les champs et enums vérifiés un à un. |

> ⚠️ **Note de transparence sur le build.** Lors du build dans l'environnement de
> test, `app/layout.js` télécharge les polices Geist depuis Google Fonts au moment
> du build ; ce réseau de test bloque `fonts.googleapis.com`, ce qui faisait
> échouer le build pour une raison **sans rapport avec l'intégration**. Pour
> valider mon code, j'ai temporairement neutralisé ce téléchargement de police,
> confirmé que **tout compile**, puis **restauré `layout.js` à l'identique**. Sur
> une machine normale disposant d'Internet, le build des polices fonctionne sans
> changement.

### 4.2 Vérifier que tout fonctionne (après avoir suivi la section 5)

Une fois la base, le backend (port **3001**) et le frontend (port **3000**)
démarrés, voici comment confirmer, étape par étape, que la liaison est bien
active.

#### A. Côté backend (terminal)

**Le plus simple — le script de bout en bout déjà fourni** (nécessite `curl` et
`jq`). ⚠️ Le script pointe par défaut sur le port `8080` (valeur de déploiement) :
en local, surchargez l'URL avec `BASE_URL` :
```bash
cd backend
BASE_URL=http://localhost:3001/api ./smoke-test.sh
```
Il déroule : inscription → création de post → fil → like → commentaire →
notifications → profil, et doit se terminer par **`✅ Parcours complet réussi`**.

**Vérifications manuelles équivalentes :**
```bash
# 1. Le fil doit renvoyer les 3 publications du seed (Marie, Thomas, Sophie)
curl http://localhost:3001/api/posts

# 2. La connexion doit renvoyer { accessToken, refreshToken }
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"marie@sanslimites.fr","password":"password123"}'
```

#### B. Côté frontend (navigateur) — checklist

| # | Action | Résultat attendu (= liaison OK) |
|---|---|---|
| 1 | Ouvrir http://localhost:3000 | Le bandeau orange **« Mode démonstration » a disparu** et le fil affiche les **3 posts du seed** (et non les 4 posts d'exemple). **C'est le signal principal.** |
| 2 | Ouvrir les DevTools (F12) → onglet **Réseau**, filtrer `api`, recharger | Des requêtes vers `localhost:3001/api` en statut **200**. Aucune erreur rouge « Impossible de joindre le serveur » dans la **Console**. |
| 3 | Aller sur `/login`, se connecter avec `marie@sanslimites.fr` / `password123` | Redirection vers `/` **sans message d'erreur**. Dans DevTools → **Application → Local Storage**, la clé `sl_access_token` est présente. |
| 4 | Liker une publication | Onglet Réseau : `POST /api/posts/:id/like` en **200/201**. Le compteur de likes augmente. |
| 5 | Ouvrir un post et ajouter un commentaire | `POST /api/posts/:id/comments` en **201**. |
| 6 | Aller sur `/notifications` | Les **vraies notifications de Marie** s'affichent (like, commentaire, abonnement). « Tout marquer comme lu » → `PATCH /api/notifications/read-all`. Suppression → `DELETE /api/notifications/:id`. |
| 7 | Cliquer l'icône de **déconnexion** (en haut à droite) | Retour à `/login`, la clé `sl_access_token` est effacée. |
| 8 | Aller sur `/signup`, créer un compte | Redirection vers `/`, puis reconnexion possible avec ce compte. |

#### C. Distinguer « relié » de « démo » en un coup d'œil
- **Bandeau « Mode démonstration » visible** → le backend est injoignable (on voit
  les données d'exemple).
- **Requêtes 200 vers `:3001` dans l'onglet Réseau** → le frontend parle bien au
  backend.

### 4.3 Dépannage (si quelque chose ne marche pas)

| Symptôme | Cause probable / solution |
|---|---|
| Le bandeau « démo » reste affiché | **Avez-vous redémarré `npm run dev` APRÈS la création de `.env.local` ?** Next.js ne lit les variables `NEXT_PUBLIC_*` qu'au démarrage. Vérifiez aussi que le backend répond : `curl http://localhost:3001/api/posts`. |
| Erreur **CORS** dans la console | Vérifiez `FRONTEND_URL=http://localhost:3000` dans `backend/.env`, puis **redémarrez le backend**. |
| **401** sur les routes protégées | L'access token expire au bout de 15 min → reconnectez-vous. |
| Fil **vide** mais sans bandeau démo | Le backend répond mais la base est vide : relancez `npm run db:seed`. |
| `smoke-test.sh` : « Connection refused » | Le script vise le port `8080` par défaut. Préfixez avec `BASE_URL=http://localhost:3001/api` (voir 6.2.A). |
| **400** à l'inscription | Mot de passe < 8 caractères (règle du backend), ou email déjà utilisé. |

---

## 5. Problèmes connus & limites (à traiter ensuite)

Ces points ne **cassent pas** le projet, mais sont des limites assumées que je
signale honnêtement :

1. **Champs d'inscription non persistés.** Le `RegisterDto` du backend n'accepte
   que `email, password, username, name` (et **rejette** tout champ supplémentaire,
   `forbidNonWhitelisted: true`). Les champs `âge / sexe / niveau / objectif /
   sports préférés` du formulaire ne sont donc **pas envoyés** ni stockés.
   → *Correctif futur :* étendre `RegisterDto` + le modèle `User` (et créer les
   liaisons `UserSport`).

2. **« Sauvegarde » (bookmark) des posts.** Aucune route/table backend ne gère les
   posts sauvegardés. Le bouton reste **local** (état React uniquement).

3. **`isLiked` par utilisateur absent du feed.** `GET /api/posts` ne dit pas si
   l'utilisateur courant a déjà liké chaque post → l'état part « non liké », puis
   le like est optimiste. → *Correctif futur :* enrichir le feed avec le contexte
   du viewer.

4. **Catégorie/sport du post.** Le feed n'inclut pas le nom du sport → libellé
   générique « Sport » dans `PostCard`. → *Correctif futur :* inclure `sport` dans
   le `include` du service `posts`.

5. **Messagerie temps réel (WebSocket) non câblée.** Brancher la `MessagingGateway`
   (Socket.io) nécessiterait d'ajouter la dépendance `socket.io-client` au front et
   d'authentifier le socket (`WsJwtGuard`). Je l'ai **délibérément laissée
   documentée plutôt que câblée**, pour ne pas introduire une dépendance que je ne
   pouvais pas valider ici. → *Correctif futur :* `npm i socket.io-client`,
   connexion à `NEXT_PUBLIC_WS_URL`, événements `conversation:join`, `message:send`,
   `message:new`, `typing`, `message:read`.

6. **Backend non exécuté de bout en bout dans l'environnement de test.** Il manque
   un PostgreSQL et le téléchargement du moteur Prisma était bloqué par le réseau du
   sandbox. Le code d'intégration et le seed ont été **relus et vérifiés contre le
   schéma**, mais je n'ai pas pu lancer un test end-to-end front↔back ici. À valider
   sur votre poste avec la procédure de la section 5.

7. **Pages encore en mock.** `profil`, `messages`, `categories`, `evenements`,
   `groupe`, `decouvrir`, `actualites` utilisent encore des données d'exemple : le
   backend n'expose pas (encore) toutes les routes correspondantes (sports, groupes,
   événements, défis). Le README backend décrit le patron à suivre pour les créer.

---

## 6. Récapitulatif

✅ Authentification (connexion + inscription) reliée au backend.
✅ Fil d'actualité, likes et commentaires reliés (avec repli démo).
✅ Notifications reliées (chargement, tout marquer comme lu, suppression).
✅ Déconnexion fonctionnelle.
✅ Backend prêt à démarrer (`.env` + seed).
✅ Build frontend validé.
⚠️ Limites listées en section 7 (messagerie temps réel, champs d'inscription, etc.).
