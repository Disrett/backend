# Politique de sécurité

## Versions supportées

Le projet est en phase de développement initial (`0.x`). Seule la branche `main` reçoit des correctifs de sécurité.

| Version | Supportée |
|---|---|
| `0.1.x` | ✅ |
| `< 0.1` | ❌ |

## Signaler une vulnérabilité

Ne déclare **pas** de faille de sécurité via une issue publique.

Envoie un rapport privé à **security@sanslimites.fr** (adresse à adapter par l'équipe). Inclus :

- une description de la faille et de son impact ;
- les étapes de reproduction ;
- la version ou le commit concerné ;
- toute piste de correctif éventuelle.

Tu recevras un accusé de réception sous 72 heures. Nous t'informons de l'avancement du traitement et te créditons à la résolution, sauf demande contraire.

## Bonnes pratiques en vigueur dans le code

- Les mots de passe sont hachés avec **argon2** ; le mot de passe en clair n'est jamais stocké.
- Les refresh tokens sont stockés **hachés** et soumis à rotation à chaque émission.
- Les secrets ne vivent jamais dans le code : ils passent par des variables d'environnement (`.env` en local, `Secret` Kubernetes en cluster).
- Les valeurs présentes dans `.env.example` et `k8s/*-secret.yaml` sont des valeurs de **test** : remplace-les pour tout déploiement réel.
- Les messages d'authentification restent génériques pour ne pas révéler l'existence d'un compte.

## Points connus à durcir avant la production

- `/auth/refresh` est volontairement simplifié : ajoute une stratégie Passport `jwt-refresh` dédiée (voir ADR-003).
- La connexion WebSocket n'est pas encore authentifiée : ajoute un `WsJwtGuard` qui valide `socket.handshake.auth.token`.
- Sors les secrets du dépôt (Sealed Secrets, SOPS ou External Secrets) avant tout cluster non jetable.
