@AGENTS.md

# CLAUDE.md — surcouche Claude Code

La première ligne importe `AGENTS.md` : Claude Code lit donc **les mêmes instructions** que tous les autres agents. Ce fichier ne contient que les ajouts propres à Claude Code, pour éviter toute duplication.

## Serveurs MCP

La configuration des serveurs MCP du projet vit dans `.claude/settings.json` :

- `git` — lecture de l'historique, création de branches, commits.
- `context7` — récupère la documentation à jour de NestJS et Prisma au lieu de te fier à des connaissances datées.

Préfère toujours `context7` à ta mémoire pour les API de bibliothèques : Prisma et NestJS évoluent vite.

## Mémoire à trois niveaux

- Niveau utilisateur (`~/.claude/CLAUDE.md`) — tes préférences personnelles, hors dépôt.
- Niveau projet (ce fichier) — conventions partagées par l'équipe.
- Niveau sous-répertoire — pose un `CLAUDE.md` plus précis dans un dossier si ses règles diffèrent.

## Rappels propres à ce dépôt

- Les instructions de `AGENTS.md` sont indicatives. Pour ce qui doit s'exécuter **systématiquement** (formatage, vérifications avant commit), préfère un hook déterministe à une consigne en prose.
- N'invente pas de routes ou de champs : la source de vérité du contrat HTTP est `openapi.yaml`, celle du modèle de données est `prisma/schema.prisma`.
