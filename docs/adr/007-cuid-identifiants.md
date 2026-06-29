# ADR-007 : cuid() pour les identifiants

## Statut

Accepté

## Contexte

Les identifiants apparaissent dans les URL (profils, posts) et le frontend en
manipule. Des entiers séquentiels exposeraient le volume de données et seraient
devinables ; ils compliqueraient aussi une éventuelle génération côté client.

## Décision

Nous utilisons **`cuid()`** comme identifiant par défaut de toutes les entités.

## Conséquences

- Positif : identifiants URL-safe, non séquentiels, non devinables.
- Positif : pas de coordination centrale pour générer un identifiant.
- Négatif : identifiants plus longs qu'un entier ; tri chronologique non garanti
  par l'identifiant lui-même (on s'appuie sur `createdAt`).
