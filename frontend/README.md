# SL SANSLimites

> Plateforme sociale dédiée aux sportifs et passionnés de dépassement de soi.

SANSLimites est une application web qui permet aux athlètes de partager leurs performances, de relever des défis quotidiens, de découvrir des athlètes inspirants et de rester connectés avec une communauté sportive motivante.

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

---

## Prérequis

- **Node.js** v18 ou supérieur
- **npm** v9 ou supérieur

---

## Installation et lancement

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd sans-limites

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

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
│       └── mockData.js               # Données fictives (profil, publications)
│
├── public/                           # Assets statiques
│   └── background.png                # Image de fond (pages contact, login, signup)
│
├── next.config.mjs                   # Configuration Next.js
├── postcss.config.mjs                # Configuration PostCSS (Tailwind)
├── jsconfig.json                     # Alias de chemins (@/)
├── eslint.config.mjs                 # Configuration ESLint
└── package.json                      # Dépendances et scripts
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

## Contributeurs

Ce projet a été développé en collaboration dans le cadre d'un projet de groupe.
