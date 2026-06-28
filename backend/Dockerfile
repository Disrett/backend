# ============================================================================
#  Sans Limites — API NestJS
#  Build multi-étapes. Base Debian slim (recommandée avec Prisma : openssl dispo,
#  binaires d'engine standards — moins de pièges qu'avec Alpine/musl).
# ============================================================================

# ---- Étape 1 : build ----
FROM node:22-slim AS builder
WORKDIR /app

# openssl est requis par les engines Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Installe TOUTES les dépendances (dev incluses : nest-cli, prisma)
COPY package*.json ./
RUN npm ci

# Génère le client Prisma puis compile le TypeScript
COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ---- Étape 2 : runtime ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# On reprend node_modules tel quel : il contient le client Prisma déjà généré
# ET la CLI prisma, nécessaire à `prisma db push` (initContainer).
# --chown=node:node : les fichiers appartiennent à l'utilisateur d'exécution,
# sinon npx/prisma échouent en EACCES une fois passé en USER node.
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --chown=node:node package*.json ./

# Le répertoire de travail lui-même doit appartenir à node (écriture des
# fichiers temporaires npm/npx).
RUN chown node:node /app

# Exécution sans privilèges (l'image node fournit déjà l'utilisateur `node`)
USER node

EXPOSE 3001
CMD ["node", "dist/main.js"]
