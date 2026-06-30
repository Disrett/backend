#!/usr/bin/env bash
# Test de bout en bout de l'API Sans Limites.
# Déroule : inscription -> création de post -> liste -> like -> commentaire
#           -> notifications -> profil.
# Prérequis : curl et jq.  Usage : ./scripts/smoke-test.sh
set -euo pipefail

BASE="${BASE_URL:-http://localhost:8080/api}"
# Email unique à chaque exécution pour éviter les conflits
STAMP="$(date +%s)"
EMAIL="test+${STAMP}@sans-limite.dev"
USERNAME="tester_${STAMP}"

say() { printf "\n\033[1;36m== %s\033[0m\n" "$1"; }

say "1. Inscription ($EMAIL)"
TOKENS=$(curl -sf -X POST "$BASE/auth/register" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"motdepasse123\",\"username\":\"$USERNAME\",\"name\":\"Testeur\"}")
ACCESS=$(echo "$TOKENS" | jq -r .accessToken)
echo "access token: ${ACCESS:0:25}..."
AUTH="Authorization: Bearer $ACCESS"

say "2. Création d'une publication"
POST=$(curl -sf -X POST "$BASE/posts" -H "$AUTH" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Premier run","content":"10 km ce matin 🏃"}')
POST_ID=$(echo "$POST" | jq -r .id)
echo "post id: $POST_ID"

say "3. Liste du fil d'actualité"
curl -sf "$BASE/posts" | jq '.[].title'

say "4. Like de la publication"
curl -sf -X POST "$BASE/posts/$POST_ID/like" -H "$AUTH" | jq -c .

say "5. Commentaire"
curl -sf -X POST "$BASE/posts/$POST_ID/comments" -H "$AUTH" \
  -H 'Content-Type: application/json' \
  -d '{"content":"Bravo !"}' | jq -c '{author: .author.username, content}'

say "6. Notifications"
curl -sf "$BASE/notifications" -H "$AUTH" | jq -c .

say "7. Profil public ($USERNAME)"
curl -sf "$BASE/users/$USERNAME" | jq '{username, name, posts: ._count.posts}'

say "✅ Parcours complet réussi"
