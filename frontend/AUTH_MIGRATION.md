# Migration de l'authentification : localStorage → NextAuth (cookies httpOnly)

## Ce qui a changé et pourquoi

### Problème initial
Les tokens JWT (`accessToken`, `refreshToken`) étaient stockés dans `localStorage`.
**Risque XSS critique** : tout script JavaScript (y compris une librairie compromise)
peut lire `localStorage` et exfiltrer les tokens vers un serveur malveillant.

### Solution : NextAuth + cookies httpOnly
- Les tokens sont désormais stockés dans un **cookie httpOnly chiffré** par NextAuth.
- Un cookie `httpOnly` est **invisible à JavaScript** (`document.cookie` ne le voit pas).
- NextAuth gère automatiquement le **refresh** et la **rotation des tokens**.
- Le middleware Next.js protège les routes **côté serveur**, avant même que la page soit envoyée.

---

## Fichiers modifiés / créés

| Fichier | Action | Raison |
|---|---|---|
| `auth.js` | **Créé** | Configuration NextAuth (provider Credentials + callbacks JWT/session) |
| `middleware.js` | **Créé** | Protection des routes côté serveur (Edge Runtime) |
| `app/api/auth/[...nextauth]/route.js` | **Créé** | Route handler NextAuth |
| `app/components/providers/SessionProvider.js` | **Créé** | Wrapper client pour `useSession()` |
| `app/layout.js` | **Modifié** | Intégration du `SessionProvider` |
| `app/lib/auth.js` | **Remplacé** | localStorage → NextAuth (`signIn`, `signOut`) |
| `app/lib/api.js` | **Modifié** | Token lu depuis `getSession()` au lieu de `localStorage` |
| `app/components/login-page.js` | **Modifié** | Utilise `loginWithCredentials()` → `signIn('credentials')` |
| `app/components/signup-page.js` | **Modifié** | Inscription API puis connexion via NextAuth |
| `.env.local` / `.env.example` | **Modifié** | Ajout de `AUTH_SECRET` et `NEXTAUTH_URL` |

---

## Configuration requise

### 1. Générer `AUTH_SECRET`
```bash
openssl rand -base64 32
```
Coller la valeur dans `.env.local` :
```env
AUTH_SECRET=votre_secret_ici
NEXTAUTH_URL=http://localhost:3000  # ou votre URL de prod
```

### 2. Exposer `accessToken` dans la session (si nécessaire)
Dans `auth.js`, le callback `session()` n'expose pas le `accessToken` côté client par défaut.
Si vous avez besoin du token pour des appels client-side, ajoutez dans `auth.js` :
```js
async session({ session, token }) {
  session.accessToken = token.accessToken; // uniquement si nécessaire
  // ...
}
```
Mais privilégiez les **Server Actions** ou **Route Handlers** pour les appels authentifiés.

### 3. Backend : exposer `user` dans la réponse login/register (recommandé)
Pour que NextAuth puisse stocker `id`, `username`, `name` dans la session, le backend
devrait renvoyer :
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "...", "username": "...", "name": "..." }
}
```
Modifier `auth.service.ts` → `issueTokens()` pour inclure les infos user dans la réponse.

---

## Accéder à la session dans les composants

### Client Component
```js
'use client';
import { useSession, signOut } from 'next-auth/react';

export default function MonComposant() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Chargement...</p>;
  if (!session) return <p>Non connecté</p>;
  
  return (
    <div>
      <p>Bonjour {session.user.username}</p>
      <button onClick={() => signOut({ callbackUrl: '/login' })}>
        Déconnexion
      </button>
    </div>
  );
}
```

### Server Component
```js
import { auth } from '@/auth';

export default async function MonServeurComposant() {
  const session = await auth();
  if (!session) redirect('/login');
  
  return <p>Bonjour {session.user.username}</p>;
}
```

---

## Gestion de l'erreur de refresh (token expiré)

Si le refresh token expire (après 7 jours), la session contiendra `error: 'RefreshAccessTokenError'`.
Gérez ce cas dans vos composants :

```js
const { data: session } = useSession();

useEffect(() => {
  if (session?.error === 'RefreshAccessTokenError') {
    signOut({ callbackUrl: '/login' });
  }
}, [session]);
```

---

## Problèmes de sécurité restants (à traiter côté backend)

1. **Endpoint `/api/auth/refresh` sans authentification** : le refresh token est passé en clair
   dans le body. Considérez une stratégie Passport dédiée (jwt-refresh) ou un cookie httpOnly
   pour le refresh token côté backend également.

2. **Rate limiting** : ajoutez `@nestjs/throttler` sur les endpoints `/auth/login` et
   `/auth/register` pour limiter les tentatives par brute force.

3. **Headers de sécurité** : ajoutez Helmet (`npm i @nestjs/helmet`) dans `main.ts` :
   ```ts
   import helmet from 'helmet';
   app.use(helmet());
   ```
