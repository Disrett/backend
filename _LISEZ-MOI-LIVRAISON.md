# Livraison — Documentation du backend Sans Limites

Cette documentation a été produite après lecture intégrale du backend (code
NestJS, schéma Prisma, infrastructure Nix/Lix, Taskfile, Dockerfile, manifestes
Kubernetes, CI, OpenAPI, scripts). Elle applique **à la lettre** le cadre décrit
dans le document de référence sur la documentation technique moderne.

## Où placer ces fichiers

Tout est rangé sous `backend/`, prêt à être copié à la racine du dossier backend
existant. Aucun fichier source n'a été modifié : ce sont des ajouts.

## Comment ce livrable applique le document de référence

| Prescription du document | Réalisation |
|---|---|
| **Fichiers de normes communautaires** (README, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE, CHANGELOG, SECURITY, gabarits `.github/`) | `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md` (format Keep a Changelog), `LICENSE` (gabarit à compléter), `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/`. Le README backend existait déjà. |
| **AGENTS.md** : écrit à la main, < 200 lignes, ordres + commandes exactes, non-inférabilité, Définition de « Terminé », règles d'escalade, journal des décisions, sections par tâche | `AGENTS.md` (121 lignes), entièrement dérivé du code réel : commandes Task/npm exactes, pièges Nix/Prisma, conventions invisibles aux linters, limites à ne jamais franchir. |
| **CLAUDE.md -> AGENTS.md** (symlink, comme dans la synthèse) | `CLAUDE.md` est un lien symbolique vers `AGENTS.md` : Claude Code lit exactement les mêmes instructions, source unique de vérité. La configuration spécifique à Claude (MCP) vit dans `.claude/settings.json`. |
| **MCP** (`.claude/settings.json`) | Configuration des serveurs `git` et `context7`. |
| **Diátaxis** : séparation stricte tutoriels / guides / référence / explication | Arborescence `docs/{tutorials,how-to,reference,explanation}/`, chaque document servant un seul besoin. |
| **ADR** (contexte / décision / conséquences) | `docs/adr/` : gabarit + 8 décisions réelles extraites du code (NestJS, Prisma, JWT+argon2, Nix/Lix, k3d, Socket.io, cuid, images par URL). |
| **Techniques d'écriture** (voix active, impératif, présent, phrases courtes, structure parallèle, terminologie cohérente, ordres + commandes) | Appliquées dans tous les documents. |
| **Documentation comme code** (versionnée, revue, élaguée) | Rappelé dans `docs/README.md`, `CONTRIBUTING.md` et le gabarit de PR (checklist de mise à jour de la doc). |

## Arborescence produite

```
backend/
├── AGENTS.md                      # instructions agents IA (< 200 lignes)
├── CLAUDE.md -> AGENTS.md         # symlink (Claude Code lit AGENTS.md)
├── CONTRIBUTING.md                # guide contributeur
├── CODE_OF_CONDUCT.md             # Contributor Covenant
├── SECURITY.md                    # signalement de vulnérabilités
├── CHANGELOG.md                   # Keep a Changelog
├── LICENSE                        # gabarit à compléter (décision de l'équipe)
├── .claude/
│   └── settings.json              # serveurs MCP (git, context7)
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       └── config.yml
└── docs/
    ├── README.md                  # carte Diátaxis de la documentation
    ├── adr/                       # registres de décision (gabarit + 8 ADR)
    ├── tutorials/                 # apprentissage par la pratique
    ├── how-to/                    # guides orientés objectif
    ├── reference/                 # faits à consulter (API, données, env, etc.)
    └── explanation/               # compréhension des concepts
```

## Deux points qui demandent une décision humaine

- **LICENSE** : aucune licence n'a été imposée. Le fichier est un gabarit qui
  oriente le choix (décision juridique réservée aux titulaires des droits).
- **Adresse de contact sécurité** : `SECURITY.md` mentionne
  `security@sanslimites.fr`, à remplacer par l'adresse réelle de l'équipe.

## Maintenir cette documentation

Le document de référence insiste : une documentation générée mécaniquement perd
en valeur si elle n'est pas relue et entretenue. Traite ces fichiers comme du
code — revus en PR, mis à jour quand le comportement change, élagués quand une
règle ne s'applique plus. La liste de contrôle du gabarit de PR rappelle de
mettre à jour la référence concernée dans la même PR.
