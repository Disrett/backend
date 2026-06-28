# SL SANSLimites

> Plateforme sociale dédiée aux sportifs et passionnés de dépassement de soi.

SANSLimites est une application web qui permet aux athlètes de partager leurs performances, de relever des défis quotidiens, de découvrir des athlètes inspirants et de rester connectés avec une communauté sportive motivante.

> 🔗 **Projet full-stack.** Le frontend (Next.js) est désormais **relié à une API backend NestJS** (authentification, fil d'actualité, likes, commentaires, notifications). Si le backend n'est pas démarré, l'application bascule automatiquement en **mode démonstration** (données d'exemple). Voir [`INTEGRATION.md`](./INTEGRATION.md) pour le détail de la liaison front ↔ back, et [`CHANGE.md`](./CHANGE.md) pour le journal des changements.

---

## Table des matières

- [Aperçu](#aperçu)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
- [Structure du projet](#structure-du-projet)
- [Pages de l'application](#pages-de-lapplication)
- [Composants](#composants)
- [Données](#données)
- [Charte graphique](#charte-graphique)
- [Documentation](#documentation)
- [Contributeurs](#contributeurs)

---

## Aperçu

SANSLimites est pensé comme un réseau social sportif complet. L'utilisateur dispose d'un fil d'actualité, d'un système de messagerie privée, d'une page de recherche, d'un explorateur de catégories de sports, de pages de groupes et d'événements, d'un centre de notifications, d'une page profil personnalisée, d'une page de paramètres complète, ainsi que de pages d'authentification (connexion et inscription).

L'interface s'inspire des grandes plateformes sociales avec une sidebar de navigation fixe sur desktop et un menu mobile adapté.

---

## Technologies utilisées

| Technologie | Version | Rôle |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.1 | Framework React (App Router) |
| [React](https://react.dev/) | 19.2.3 | Bibliothèque UI |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Styles utilitaires |
| [Lucide React](https://lucide.dev/) | 0.562.0 | Icônes |
| [Google Fonts](https://fonts.google.com/) | — | Typographie (Geist, Montserrat) |

**Côté backend** (dépôt/dossier séparé, voir [`INTEGRATION.md`](./INTEGRATION.md)) :

| Technologie | Rôle |
|---|---|
| [NestJS](https://nestjs.com/) | API REST + WebSocket (auth JWT, posts, notifications, messagerie) |
| [Prisma](https://www.prisma.io/) | ORM (schéma, migrations, accès base) |
| [PostgreSQL](https://www.postgresql.org/) | Base de données |
| [Nix / Lix](https://nixos.org/) + [Task](https://taskfile.dev/) + [k3d](https://k3d.io/) | Environnement reproductible & déploiement local (k3s dans Docker) |

---

## Prérequis

**Frontend :**
- **Node.js** v18 ou supérieur
- **npm** v9 ou supérieur

**Backend** (si vous voulez l'app reliée et pas seulement en mode démo) :
- **Docker** (démon démarré) — k3d crée un k3s dans Docker
- **Nix / Lix** — fournit l'outillage (node, task, k3d, kubectl, prisma)

> Sans backend, le frontend fonctionne quand même : il s'affiche en **mode démonstration** avec des données d'exemple.

---

## Installation et lancement

Le projet a deux parties. Pour l'application **reliée** (recommandé), lancez le backend puis le frontend. Pour une simple découverte de l'interface, le frontend seul suffit (mode démo).

### 1. Backend (API) — via Nix + Task + k3d

L'API tourne dans un cluster k3d et est exposée sur **http://localhost:8080/api**. Procédure résumée (chaque commande est commentée dans [`INTEGRATION.md`](./INTEGRATION.md)) :

```bash
cd backend
nix develop                         # shell outillé (node, task, k3d, kubectl, prisma)
task registry && task up            # registre d'images + cluster k3d
task build && task push             # construit/pousse l'image (npm ci + prisma generate se font ICI)
task deploy                          # déploie PostgreSQL + API (schéma synchronisé au démarrage)
kubectl -n sans-limite exec deploy/api -- npm run db:seed   # données + comptes de test
```

> ⚠️ **Pas de `npm install` côté backend** : les dépendances sont installées dans l'image Docker. Après toute modification du code backend, reconstruisez l'image (`task redeploy`), sinon le cluster continue de tourner l'ancienne version.

### 2. Frontend (interface)

```bash
cd frontend

# Pointer le front vers l'API (port 8080 en mode k3d) :
echo 'NEXT_PUBLIC_API_URL=http://localhost:8080/api' > .env.local

npm install
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000). Ouvrez-la via **localhost** (et non l'URL « Network » en `192.168.x.x`) pour respecter le CORS du backend.

> 💡 Le port de l'API dépend du mode de lancement du backend : **8080** via Nix/Task/k3d, **3001** si vous lancez le backend en local avec `npm run start:dev`. Adaptez `NEXT_PUBLIC_API_URL` en conséquence, puis relancez `npm run dev`.

### Autres commandes disponibles

```bash
npm run build   # Compilation pour la production
npm run start   # Lancer le serveur de production (après build)
npm run lint    # Vérification du code avec ESLint
```

> ⚠️ **Remarque** : le fichier `next.config.mjs` ne doit pas contenir `reactCompiler: true` sans avoir installé `babel-plugin-react-compiler`. Si vous rencontrez une erreur de build liée à ce package, supprimez simplement cette ligne.

---

## Structure du projet

```
sans-limites/
│
├── app/                              # Dossier principal Next.js (App Router)
│   ├── layout.js                     # Layout racine (polices, métadonnées globales)
│   ├── globals.css                   # Styles globaux (Tailwind + CSS custom)
│   ├── page.js                       # Page d'accueil (fil d'actualité)
│   │
│   ├── actualites/
│   │   └── page.js                   # Page des actualités (articles & tendances)
│   ├── categories/
│   │   ├── page.js                   # Listing de toutes les catégories de sports
│   │   └── [slug]/
│   │       └── page.js               # Page détail d'une catégorie (route dynamique)
│   ├── contact/
│   │   └── page.js                   # Formulaire de contact
│   ├── decouvrir/
│   │   └── page.js                   # Découvrir des athlètes et défis
│   ├── evenements/
│   │   └── page.js                   # Listing d'événements sportifs
│   ├── groupe/
│   │   └── page.js                   # Page groupes et communautés
│   ├── login/
│   │   └── page.js                   # Page de connexion
│   ├── messages/
│   │   └── page.js                   # Messagerie privée
│   ├── notifications/
│   │   └── page.js                   # Centre de notifications
│   ├── parametres/
│   │   └── page.js                   # Page paramètres (6 sous-sections)
│   ├── profil/
│   │   └── page.js                   # Page profil utilisateur
│   ├── rechercher/
│   │   └── page.js                   # Recherche (athlètes, posts, défis, catégories)
│   ├── signup/
│   │   └── page.js                   # Page d'inscription
│   │
│   ├── components/                   # Composants réutilisables
│   │   ├── header.js                 # Barre de navigation supérieure
│   │   ├── sidebar.js                # Menu latéral (desktop)
│   │   ├── mobilemenu.js             # Menu latéral (mobile)
│   │   ├── featuredathletes.js       # Section "Athlètes de la semaine"
│   │   ├── dailychallenge.js         # Bloc "Défi du jour"
│   │   ├── postcard.js               # Carte d'une publication
│   │   ├── postmodal.js              # Modal de détail d'une publication
│   │   ├── ProfileHeader.js          # En-tête de la page profil
│   │   ├── PublicationsGrid.js       # Grille de publications (page profil)
│   │   ├── ObjectivesAndChallenges.js # Objectifs et défis actifs (page profil)
│   │   ├── login-page.js             # Composant page connexion
│   │   ├── signup-page.js            # Composant page inscription
│   │   └── Footer/
│   │       └── Footer.js             # Pied de page
│   │
│   ├── data/
│   │   └── sportsData.js             # Données des sports (catégories)
│   │
│   └── lib/
│       ├── api.js                    # Client API (toutes les requêtes vers le backend)
│       ├── auth.js                   # Stockage des jetons JWT (localStorage)
│       ├── mappers.js                # Conversion des données backend → format des composants
│       └── mockData.js               # Données fictives (repli en mode démo)
│
├── public/                           # Assets statiques
│   └── background.png                # Image de fond (pages contact, login, signup)
│
├── next.config.mjs                   # Configuration Next.js
├── postcss.config.mjs                # Configuration PostCSS (Tailwind)
├── jsconfig.json                     # Alias de chemins (@/)
├── eslint.config.mjs                 # Configuration ESLint
├── package.json                      # Dépendances et scripts
└── .env.local                        # Variables d'env front (NEXT_PUBLIC_API_URL) — non versionné
```

---

## Pages de l'application

### `/` — Accueil

Le fil d'actualité principal. Affiche :
- La section **Athlètes de la semaine** avec leurs stats et un bouton "Suivre"
- Le **Défi du jour** avec un bouton de participation
- La liste des **publications** des membres (like, sauvegarde, commentaires)
- Un **modal de détail** par publication avec fil de commentaires
- Le **Footer** en bas de page

### `/actualites` — Actualités

Page de contenu éditorial sportif. Affiche :
- Un article mis en avant
- Une grille d'articles avec filtres par catégorie
- Une section "Tendances" avec les articles les plus populaires

### `/categories` — Catégories

Explorateur de sports disponibles sur la plateforme. Fonctionnalités :
- Barre de recherche pour filtrer les sports
- Grille de cartes par sport avec image, nom, tagline et nombre d'abonnés
- Lien vers la page détail de chaque sport

### `/categories/[slug]` — Détail d'une catégorie

Page dynamique d'un sport spécifique. Affiche les statistiques, les membres actifs et les événements liés à cette catégorie.

### `/contact` — Contact

Formulaire de contact avec :
- Champs Nom, Prénom, Adresse mail, Message
- Case à cocher conditions d'utilisation
- Fond plein écran (`background.png`) avec effet glassmorphism

### `/decouvrir` — Découvrir

Page d'exploration permettant de découvrir des athlètes inspirants et des défis populaires recommandés par la communauté.

### `/evenements` — Événements

Listing d'événements sportifs avec :
- Filtres par sport, niveau et localisation
- Informations détaillées (date, lieu, participants, niveau requis)
- Bouton de participation

### `/groupe` — Groupes

Page de gestion des groupes et communautés sportives. Permet de rejoindre des groupes thématiques, voir leurs activités et leurs membres.

### `/login` — Connexion

Formulaire de connexion avec :
- Champs e-mail et mot de passe (avec affichage/masquage)
- Fond animé avec effet de particules
- Lien vers la page d'inscription

### `/messages` — Messages

Messagerie privée complète. Fonctionnalités :
- Liste des conversations avec statut en ligne, messages non lus, épinglés et favoris
- Fil de discussion avec support texte et images
- Réactions aux messages (emojis)
- Filtres (toutes, non lues, archivées)
- Panneau d'informations sur le contact

### `/notifications` — Notifications

Centre de notifications de l'utilisateur. Fonctionnalités :
- Affichage par type : like ❤️, commentaire 💬, abonnement 👤, défi ⚡, badge 🏆, mention ⭐
- Filtre **Toutes / Non lues**
- Bouton **"Tout marquer comme lu"**
- Actions au survol : marquer comme lu ✓, supprimer 🗑️

### `/parametres` — Paramètres

Page de paramètres avec navigation latérale et 6 sous-sections :
- **Profil** — photo, nom, bio, localisation, sport principal
- **Compte** — e-mail, mot de passe, déconnexion, suppression du compte
- **Apparence** — thème (clair/sombre/système), taille du texte, langue
- **Accessibilité** — animations réduites, contraste élevé, lecteur d'écran…
- **Notifications** — préférences e-mail et push par type d'événement
- **Confidentialité** — visibilité du profil, des activités, messages privés…

### `/profil` — Profil

Page profil style Strava. Affiche :
- En-tête avec avatar, nom, bio, localisation et bouton d'action
- Barre de statistiques (activités, km, heures, abonnés, abonnements)
- Onglets : Vue d'ensemble / Activités / Défis
- Sidebar avec trophées récents, objectif de la semaine, objectifs et défis actifs
- Grille de publications récentes

### `/rechercher` — Recherche

Moteur de recherche global. Permet de chercher parmi :
- Athlètes
- Publications
- Défis
- Catégories de sports

### `/signup` — Inscription

Formulaire d'inscription enrichi avec :
- Champs Nom, E-mail, Mot de passe, Âge, Sexe
- Niveau sportif et objectif sportif (listes déroulantes)
- Sélecteur de sports favoris organisé par catégories (cases à cocher)
- Champ "autre sport" personnalisable
- Fond animé avec effet de particules

---

## Composants

### `Header`
Barre supérieure présente sur toutes les pages. Contient :
- Logo SANSLimites (mobile)
- Bouton **Mon Profil** → lien vers `/profil` avec état actif
- Icône 🔔 Notifications → lien vers `/notifications`
- Icône ✉️ Messages → lien vers `/messages`
- Bouton `+` d'ajout de contenu

### `Sidebar`
Navigation principale sur **desktop** (fixe à gauche, largeur 256px). Liens actifs mis en surbrillance via `usePathname`. Liens : Accueil, Rechercher, Actualités, Catégories, Groupes, Évènements, Découvrir, Autres (avec sous-menu Paramètres / Mentions légales / Contact).

### `MobileMenu`
Navigation principale sur **mobile** (overlay plein écran). Identique à la Sidebar, avec fermeture automatique au clic sur un lien.

### `FeaturedAthletes`
Reçoit un tableau d'athlètes en props et affiche des cartes avec avatar, badge, description et statistiques (posts / abonnés).

### `DailyChallenge`
Bloc orange présentant le défi du jour avec un bouton "Participer".

### `PostCard`
Carte de publication. Reçoit en props : données du post, callbacks `onLike`, `onSave`, `onOpenModal`.

### `PostModal`
Modal de détail d'un post. Affiche le contenu complet, les commentaires existants et un champ pour en ajouter.

### `ProfileHeader`
En-tête de la page profil avec avatar, informations utilisateur et bouton Modifier / Suivre selon le contexte.

### `PublicationsGrid`
Grille de publications avec overlay au survol affichant les likes et commentaires.

### `ObjectivesAndChallenges`
Affiche les objectifs personnels et défis actifs avec barres de progression.

### `Footer`
Pied de page avec trois colonnes : Legal, Contactez-nous, Suivez-nous. Dégradé bleu/orange sur fond sombre.

---

## Données

Depuis l'intégration, plusieurs pages (accueil, notifications, connexion/inscription) récupèrent leurs données **en direct depuis l'API backend** via `app/lib/api.js`, avec conversion au bon format par `app/lib/mappers.js`. Les fichiers ci-dessous restent utilisés pour les parties non encore branchées et comme **repli en mode démonstration** (backend éteint).

### `app/data/sportsData.js`
Liste complète des sports disponibles sur la plateforme (nom, slug, image, tagline, nombre d'abonnés, membres actifs). Utilisé par les pages `/categories` et `/categories/[slug]`.

### `app/lib/mockData.js`
Données fictives pour la page profil : `mockUser` (informations utilisateur, objectifs, défis) et `mockPublications` (liste de publications récentes).

---

## Charte graphique

| Élément | Valeur |
|---|---|
| Couleur principale | `#0047AB` (bleu profond) |
| Couleur secondaire | `#FFA75F` (orange) |
| Couleur d'accentuation | `#92DCD5` (bleu clair) |
| Fond clair | `#DEF9F1` |
| Fond sombre | `#252A30` |
| Typographie | **Montserrat Bold** |

Le dégradé caractéristique de la navbar et du footer passe du bleu `#0047AB` à l'orange `#FFA75F`.

---

## Documentation

Documents complémentaires à la racine du projet :

| Fichier | Contenu |
|---|---|
| [`INTEGRATION.md`](./INTEGRATION.md) | Architecture de la liaison front ↔ back, procédure de lancement (Nix + Task + k3d), vérification de bout en bout, dépannage et limites connues. |
| [`CHANGE.md`](./CHANGE.md) | Journal chronologique de tous les changements (fusion initiale + correctifs). |
| [`RUNBOOK-base-de-donnees.md`](./RUNBOOK-base-de-donnees.md) | Accès à PostgreSQL (psql / Prisma Studio), opérations `INSERT` / `UPDATE` / `DELETE`, et emplacement des logs. |

**Repères de ports** : frontend sur **3000**, API sur **8080** (mode k3d) ou **3001** (mode `start:dev` local), PostgreSQL sur **5432** (interne au cluster).

---

## Contributeurs

Ce projet a été développé en collaboration dans le cadre d'un projet de groupe.
