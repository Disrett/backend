# Point de statut — projet Sans Limites

> **Périmètre analysé** : archives `backend.zip` (NestJS / Prisma / PostgreSQL, déployé via Nix + Task + k3d) et `frontend.zip` (Next.js 16).
> **Méthode** : analyse statique du code (routes, contrôleurs, gardes, gateway) + lecture des manifestes k8s + `npm audit` réel sur les deux `package-lock.json`.
> **Limite d'honnêteté** : tout ci-dessous vient de l'analyse du code et de l'audit des dépendances. Je n'ai pas exécuté le cluster ; les conclusions « route fonctionnelle » signifient « le code la branche correctement de bout en bout », vérifié par lecture (et cohérent avec ton `curl` qui renvoyait bien les posts).

---

## 1. Fichiers inutiles (sans valeur fonctionnelle) ou de documentation

### A. À supprimer — artefacts, doublons, scaffolding (aucune valeur au runtime)

| Fichier / dossier | Pourquoi | Action |
|---|---|---|
| `backend/dist/` | Sortie de build local ; le déploiement reconstruit dans l'image Docker | Supprimer |
| `backend/tsconfig.build.tsbuildinfo` | Cache de build local | Supprimer |
| `backend/src/**/*.js` (**26 fichiers**) | **JS compilé commité à côté des `.ts` dans `src/`** — ne doit pas être versionné | Supprimer + ajouter au `.gitignore` |
| `backend/Makefile` | **Doublon du `Taskfile.yml`** (mêmes cibles : `registry/up/build/push/deploy/logs/redeploy/down`). La doc et le workflow utilisent `task` | Garder le `Taskfile.yml`, supprimer le `Makefile` |
| `frontend/public/{next,vercel,window,globe,file}.svg` | Assets par défaut du starter Next.js, non référencés | Supprimer |
| `frontend/app/hello/` | Page bac à sable (scaffold de test, pas de contenu réel) | Supprimer |
| `frontend/app/profil-thomas/` | Doublon personnel de `/profil` | Supprimer |
| `backend/node_modules` (si présent en local) | Inutile en flux k3d (deps dans l'image) — déjà noté dans `CHANGE.md` | Supprimer |

### B. Documentation — **à garder** (utile, mais non fonctionnel à l'exécution)

`README.md`, `INTEGRATION.md`, `CHANGE.md`, `RUNBOOK-base-de-donnees.md`, `backend/DEPLOY.md`, `backend/LIX.md`, `backend/openapi.yaml` (spec d'API), `backend/requests.http` (exemples de requêtes), `backend/smoke-test.sh` (test de fumée).

### C. Données mock — **cas particulier, NE PAS supprimer encore**

`frontend/app/data/sportsData.js` (utilisé par `/categories` et `/categories/[slug]`) et `frontend/app/lib/mockData.js` (utilisé par `/profil` + repli en mode démo) **sont encore utilisés** : ils alimentent les pages pas encore branchées à l'API. À retirer **seulement** quand ces pages seront connectées au backend.

---

## 2. Routes fonctionnelles (backend & frontend)

Toutes les routes backend ci-dessous sont confirmées par leurs décorateurs (préfixe global `/api`). La colonne « Branchée » indique si une **page** du frontend l'appelle réellement.

| Route | Accès | Branchée au front ? |
|---|---|---|
| `POST /api/auth/register` | public | ✅ page `signup` |
| `POST /api/auth/login` | public | ✅ page `login` |
| `POST /api/auth/logout` | JWT | ✅ `header` |
| `GET /api/posts` | public | ✅ accueil (`getFeed`) |
| `POST /api/posts/:id/like` | JWT | ✅ accueil |
| `DELETE /api/posts/:id/like` | JWT | ✅ accueil |
| `POST /api/posts/:id/comments` | JWT | ✅ accueil |
| `GET /api/notifications` | JWT | ✅ page `notifications` |
| `PATCH /api/notifications/read-all` | JWT | ✅ page `notifications` |
| `DELETE /api/notifications/:id` | JWT | ✅ page `notifications` |

**Fonctionnel de bout en bout** (backend + front + testé via l'app) : **authentification** (inscription / connexion / déconnexion), **fil d'actualité** (lecture + like/unlike + commentaire), **notifications** (lecture / tout marquer lu / suppression).

### Routes backend qui existent mais ne sont **pas** branchées à une page

Le client `app/lib/api.js` les définit, mais **aucune page ne les appelle** encore :

| Route | Accès | Statut côté front |
|---|---|---|
| `POST /api/auth/refresh` | public | `api.refresh()` défini, jamais appelé → **pas de rafraîchissement auto** |
| `POST /api/posts` (créer) | JWT | `api.createPost()` défini, non utilisé |
| `DELETE /api/posts/:id` | JWT | `api.deletePost()` défini, non utilisé |
| `GET /api/users/:username` | public | `api.getProfile()` défini ; `/profil` utilise encore le mock |
| `POST /api/users/:id/follow` | JWT | `api.follow()` défini, non utilisé |
| `DELETE /api/users/:id/follow` | JWT | `api.unfollow()` défini, non utilisé |
| WS `message:send` / `conversation:join` / `typing` / `message:read` | **non authentifié** | gateway prête, mais `/messages` est en mock |

**Pages frontend réellement reliées à l'API** : accueil (`/`), `notifications`, `login`, `signup`, et le bouton de déconnexion du `header`.
**Pages encore en données statiques / mock** : `categories`, `profil`, `messages`, `evenements`, `groupe`, `decouvrir`, `actualites`, `rechercher`, `parametres`, `contact`.

---

## 3. Routes non encore implémentées côté backend

Modèles présents dans le schéma Prisma mais **sans contrôleur ni route REST** (d'où les pages correspondantes en mock) :

| Domaine | Modèles Prisma | Manque |
|---|---|---|
| Sports | `Sport`, `UserSport` | Aucune route → `/categories` en mock |
| Groupes | `Group`, `GroupMember` | Aucune route → `/groupe` en mock |
| Événements | `Event`, `EventParticipant` | Aucune route → `/evenements` en mock |
| Messagerie | `Conversation`, `ConversationParticipant`, `Message` | **Seulement WebSocket** — pas d'API REST pour lister/créer des conversations ni charger l'historique |
| Gamification | `Objective`, `Challenge`, `UserChallenge` | Aucune route → objectifs/défis du profil en mock |
| Profil | `User` | Pas de **mise à jour** de profil (`PATCH`), pas de **recherche** (`/rechercher`), pas d'exposition des listes abonnés/abonnements |
| Notifications | `Notification` | Pas de « marquer **une seule** notif comme lue » (uniquement `read-all`) |

---

## 4. Sécurité — points rouges et points d'attention

### 🔴 Rouge — à corriger en priorité

1. **Secrets de test commités en clair** dans `k8s/20-api-secret.yaml` et `k8s/10-postgres-secret.yaml` : `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` = `"test-…-a-remplacer"` (**prévisibles → un attaquant peut forger des tokens valides**) et mot de passe PostgreSQL en clair. → Générer des secrets forts, **ne pas les committer** (Secret monté depuis l'extérieur, SealedSecrets, ou variables CI), et les changer avant tout usage non-test.
2. **WebSocket non authentifié + confiance au client.** La gateway n'applique **aucun garde** ; `message:send` enregistre le message sous le `senderId` **fourni par le client**, `conversation:join` laisse rejoindre **n'importe quelle** room, `message:read` accepte n'importe quel `userId`. → **Usurpation d'identité** et **lecture des conversations d'autrui**. Appliquer le `WsJwtGuard` (déjà évoqué en commentaire dans le code) et déduire l'identité **du token**, pas du payload.

### 🟠 À surveiller

3. **JWT stockés dans le `localStorage`** (`app/lib/auth.js`, le code le reconnaît lui-même) : vol possible via une faille XSS. Acceptable pour un projet d'école ; en prod, préférer des **cookies `httpOnly`**.
4. **Aucune limitation de débit** (pas de `Throttler`) ni **helmet** : les routes d'auth sont exposées au brute-force, et il manque les en-têtes de sécurité HTTP.
5. **Rafraîchissement de token non branché** : `/auth/refresh` existe mais le front ne l'appelle jamais → déconnexion à l'expiration de l'access token (~15 min). Plutôt UX/disponibilité, mais lié à l'auth.

### 🟢 Bons points (déjà en place)

- Mots de passe hachés avec **argon2** (+ refresh token **haché**, **tourné**, et remis à `null` au logout).
- **`ValidationPipe`** global `whitelist` + `forbidNonWhitelisted` (rejette les propriétés inattendues).
- Profil public renvoyé via un **`select` explicite** excluant `passwordHash` / `email` / `hashedRefreshToken`.
- **CORS strict en production** (`NODE_ENV=production` → liste blanche ; la tolérance large est limitée au dev).

---

## 5. Vulnérabilités par catégorie (`npm audit`, versions actuelles)

> **Méthode & nuance** : résultats d'un `npm audit` réel au moment de l'analyse. Beaucoup de paquets listés sont de l'**outillage de build/lint** (transitifs), pas du code exécuté en production — je le signale ligne par ligne. Le `fixAvailable` de npm propose parfois un **downgrade majeur** non pertinent : la vraie correction est de **monter** vers une version corrigée.
> Correspondance : **critiques** = critical · **importantes** = high · **moyennes** = moderate · **faibles** = low.

### Frontend — 9 au total (0 critiques · 4 importantes · 4 moyennes · 1 faible)

| Gravité | Paquet (version) | Nature | Touche le runtime ? |
|---|---|---|---|
| 🟠 Importante | **`next` 16.1.1** | Nombreux avis : DoS (Image Optimizer / RSC / PPR), contournement **middleware/proxy**, **XSS** App Router, **SSRF** via upgrade WebSocket, contournement **CSRF** Server Actions, cache poisoning | **Oui** — seule vulnérabilité qui affecte l'app en exécution |
| 🟠 Importante | `flatted`, `minimatch`, `picomatch` | ReDoS / pollution de prototype | Non — transitifs via ESLint/build |
| 🟡 Moyenne | `postcss`, `ajv`, `brace-expansion`, `js-yaml` | XSS stringify / ReDoS / DoS | Non — outillage build/lint |
| 🟢 Faible | `@babel/core` | Lecture de fichier via commentaire `sourceMappingURL` | Non — build |

**Action prioritaire** : `npm audit fix` puis **monter `next`** vers la dernière 16.x corrigée (c'est la seule à impact réel sur l'application servie).

### Backend — 5 au total (0 critiques · 5 importantes · 0 moyennes · 0 faibles)

| Gravité | Paquet | Nature | Détail |
|---|---|---|---|
| 🟠 Importante | **`multer`** (transitif) | DoS via noms de champs profondément imbriqués ; DoS via nettoyage incomplet d'uploads interrompus | Tiré par `@nestjs/platform-express` → se propage à `@nestjs/core`, `@nestjs/websockets`, `@nestjs/platform-socket.io` (d'où **5** entrées pour **1** cause) |

Les cinq « importantes » remontent donc à **un seul paquet**, `multer`. **Exposition réelle faible** : le projet n'utilise aucun upload de fichier. → **Monter `@nestjs/platform-express`** vers une version embarquant `multer ≥ 2.0.2` (ou épingler `multer`). **Ignorer** la suggestion d'`npm audit` de redescendre `@nestjs/core` en 7.x (downgrade majeur cassant).

**Versions en place** : `next` 16.1.1 · `react` 19.2.3 · `@nestjs/*` ^11 · `@prisma/client` ^6 · `argon2` ^0.41 · `class-validator` ^0.14.

---

## En résumé — quoi faire en premier

1. **Sécurité (rouge)** : remplacer/sortir les secrets k8s du dépôt ; authentifier le WebSocket (`WsJwtGuard`, identité issue du token).
2. **Dépendances** : `npm audit fix` des deux côtés, puis monter `next` (front) et `@nestjs/platform-express` (back).
3. **Nettoyage** : supprimer `dist/`, les `.js` de `src/`, le `Makefile` doublon, les SVG par défaut, `app/hello/` et `app/profil-thomas/`.
4. **Fonctionnel (si le temps le permet)** : brancher les routes déjà prêtes mais inutilisées (`getProfile`, `createPost`, follow/unfollow, `refresh`) et implémenter les domaines manquants (sports, groupes, événements, messagerie REST, gamification).
