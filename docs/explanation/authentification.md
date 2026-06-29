# Explication — Authentification

Ce document explique le modèle d'authentification : pourquoi des JWT, pourquoi
deux tokens, et ce qui reste à durcir.

## Pourquoi des JWT sans état

L'API ne maintient aucune session côté serveur. Chaque requête porte sa propre
preuve d'identité sous forme de JWT signé. L'avantage : le serveur peut être
répliqué sans partager d'état de session, ce qui simplifie la mise à l'échelle
horizontale. L'inconvénient classique — l'impossibilité d'invalider un token
avant son expiration — est atténué par le choix de deux tokens.

## Pourquoi deux tokens

Un **access token** court (15 minutes par défaut) accompagne chaque requête. S'il
fuit, sa fenêtre d'exploitation est étroite. Un **refresh token** long (7 jours)
sert uniquement à obtenir un nouvel access token quand celui-ci expire.

Cette séparation est un compromis entre confort et sécurité : on ne demande pas
à l'utilisateur de se reconnecter toutes les 15 minutes, mais on limite la durée
pendant laquelle un access token volé reste utile.

## Rotation et stockage du refresh token

À chaque émission de tokens, le serveur stocke en base le **hash argon2** du
refresh token courant (`hashedRefreshToken`). Le refresh token en clair n'est
jamais conservé. À chaque renouvellement, un nouveau refresh token remplace
l'ancien : c'est la **rotation**. La déconnexion met ce champ à `null`, ce qui
invalide immédiatement le refresh token.

Conséquence : un refresh token volé cesse de fonctionner dès que l'utilisateur
légitime en obtient un nouveau ou se déconnecte.

## Pourquoi argon2 pour les mots de passe

Les mots de passe sont hachés avec argon2, une fonction de dérivation lente et
résistante aux attaques par GPU. Le mot de passe en clair n'existe jamais en
base. La vérification compare le hash, jamais la valeur.

## Le décorateur et le guard

`JwtAuthGuard` (un `AuthGuard('jwt')`) déclenche la `JwtStrategy`, qui extrait le
token du header `Authorization: Bearer`, vérifie sa signature et son expiration,
puis renvoie `{ id, username }`. Ce résultat devient `request.user`, exposé aux
contrôleurs via `@CurrentUser()`. L'identité circule ainsi sans que les
contrôleurs ne touchent au token brut.

## Ce qui est volontairement simplifié

`/auth/refresh` reçoit aujourd'hui le refresh token dans le corps de la requête.
C'est suffisant pour un squelette, mais fragile. En production, le bon schéma est
une **stratégie Passport `jwt-refresh` dédiée** et un stockage du refresh token
en **cookie `httpOnly`** côté front, hors de portée du JavaScript. Ce choix est
tracé dans [ADR-003](../adr/003-auth-jwt-argon2.md).

De même, la connexion WebSocket n'est pas encore authentifiée : un `WsJwtGuard`
reste à ajouter.
