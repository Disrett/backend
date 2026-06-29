# ADR-003 : Authentification JWT access+refresh + argon2

## Statut

Accepté

## Contexte

L'API est sans état (stateless) et consommée par un frontend Next.js. Il faut
authentifier les requêtes HTTP et, à terme, les connexions WebSocket, sans
session serveur, tout en permettant la déconnexion et le renouvellement.

## Décision

Nous émettons une paire de tokens JWT : un **access token** court (15 min) et un
**refresh token** long (7 jours). Les mots de passe sont hachés avec **argon2**.
Le hash du refresh token est stocké en base et soumis à **rotation** à chaque
émission ; la déconnexion l'invalide.

## Conséquences

- Positif : API scalable horizontalement (aucune session partagée).
- Positif : la rotation limite la fenêtre d'exploitation d'un refresh token volé.
- Négatif : `/auth/refresh` est, pour l'instant, simplifié (le refresh token
  transite dans le corps de la requête). À durcir : stratégie Passport
  `jwt-refresh` dédiée et stockage en cookie `httpOnly` côté front.
- Négatif : la connexion WebSocket n'est pas encore protégée par un guard JWT.
