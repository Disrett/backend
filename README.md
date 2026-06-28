# SL · Sans Limites — Projet complet (Frontend + Backend)

Monorepo réunissant les deux parties du réseau social sportif **Sans Limites**,
désormais **reliées** :

```
sans-limites/
├── frontend/        # Next.js / React — l'interface (port 3000)
├── backend/         # NestJS / Prisma / PostgreSQL — l'API (port 3001)
├── INTEGRATION.md   # 📄 toutes les étapes de la liaison front ↔ back
├── package.json     # scripts pratiques (optionnels)
└── README.md        # ce fichier
```

> 📄 **Pour comprendre comment les deux parties ont été reliées**, lisez
> [`INTEGRATION.md`](./INTEGRATION.md) — il détaille l'architecture, les fichiers
> impactés, la procédure de lancement, les comptes de test et les limites connues.

---

## Démarrage rapide

### Prérequis
- Node.js ≥ 18, npm ≥ 9
- PostgreSQL (Docker conseillé)

### 1) Base de données
```bash
docker run --name sl-postgres \
  -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sans_limite \
  -p 5432:5432 -d postgres:16
```

### 2) Backend (terminal 1)
```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:generate
npm run db:seed          # comptes de test + contenu de démo
npm run start:dev        # → http://localhost:3001/api
```

### 3) Frontend (terminal 2)
```bash
cd frontend
npm install
npm run dev              # → http://localhost:3000
```

Ouvrez http://localhost:3000, puis connectez-vous avec un compte de test
(mot de passe **`password123`**) :
`marie@sanslimites.fr` · `thomas@sanslimites.fr` · `sophie@sanslimites.fr`.

> Si le backend n'est pas lancé, le frontend reste utilisable en **mode
> démonstration** (données d'exemple) et l'indique par un bandeau.

---

## Scripts pratiques (depuis la racine)

```bash
npm run install:all   # installe front + back
npm run dev:front     # lance le frontend
npm run dev:back      # lance le backend
npm run seed          # (re)remplit la base de démo
```
