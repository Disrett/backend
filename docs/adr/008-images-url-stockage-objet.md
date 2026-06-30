# ADR-008 : Images stockées par URL, hors base

## Statut

Accepté

## Contexte

Posts, avatars, couvertures de groupes et d'événements comportent des images.
Stocker des binaires en base alourdit les sauvegardes, gonfle les lignes et
dégrade les performances des requêtes.

## Décision

La base ne stocke **aucune image**. Chaque entité ne garde qu'une `imageUrl`
(ou `avatarUrl`, `coverImageUrl`) pointant vers un stockage objet externe
(S3, Cloudflare R2 ou Supabase Storage).

## Conséquences

- Positif : base légère, sauvegardes rapides, requêtes performantes.
- Positif : le service de stockage gère la diffusion (CDN, cache, redimensionnement).
- Négatif : un module `upload` reste à créer pour produire ces URL ; en attendant,
  le frontend fournit directement une `imageUrl`.
- À surveiller : intégrité référentielle entre la base et le stockage objet
  (nettoyage des fichiers orphelins à la suppression).
