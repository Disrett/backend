/**
 * auth.js — Configuration NextAuth v5 (Auth.js)
 *
 * Ce fichier est le point central de l'authentification côté frontend.
 * Il utilise le provider "Credentials" pour déléguer la vérification des
 * identifiants à notre backend NestJS, puis stocke les tokens dans un cookie
 * httpOnly chiffré (jamais accessible en JavaScript côté client).
 *
 * Pourquoi ce choix ?
 * - localStorage est vulnérable au XSS : n'importe quel script peut lire les tokens.
 * - Un cookie httpOnly est illisible par JavaScript, même en cas de faille XSS.
 * - NextAuth gère automatiquement le chiffrement du cookie, le CSRF, et le refresh.
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Durée de vie de la session (doit être >= JWT_REFRESH_EXPIRES_IN du backend)
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 jours (en secondes)
  },

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },

      /**
       * authorize() est appelé côté serveur lors d'un signIn('credentials', ...).
       * Il appelle notre API NestJS et retourne un objet "user" que NextAuth
       * stocke dans son JWT interne (cookie httpOnly chiffré).
       * Retourner null déclenche une erreur CredentialsSignin.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();

          // NextAuth attend un objet avec au moins { id }.
          // On y stocke aussi les tokens backend pour les rejouer sur les appels API.
          return {
            id: data.user?.id ?? 'unknown',
            email: credentials.email,
            name: data.user?.name ?? null,
            username: data.user?.username ?? null,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 min
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    /**
     * jwt() est appelé à chaque création ou lecture du JWT NextAuth interne.
     * On y persiste les tokens backend et on gère le refresh automatique.
     */
    async jwt({ token, user }) {
      // Premier appel (après authorize) : on initialise depuis l'objet user
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          username: user.username,
        };
      }

      // Token encore valide → on le renvoie tel quel
      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token;
      }

      // Token expiré → on tente un refresh
      return refreshAccessToken(token);
    },

    /**
     * session() expose côté client uniquement ce qu'on choisit de transmettre.
     * On NE renvoie JAMAIS les tokens bruts dans la session client.
     * Seules les infos publiques (email, username, etc.) sont exposées.
     */
    async session({ session, token }) {
      session.user.username = token.username;
      session.user.id = token.sub;
      // On expose un flag d'erreur si le refresh a échoué
      if (token.error) session.error = token.error;
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
});

/**
 * Renouvelle l'access token via le backend NestJS.
 * En cas d'échec, on marque le token avec une erreur pour que l'UI puisse
 * forcer une déconnexion propre.
 */
async function refreshAccessToken(token) {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: token.sub,
        refreshToken: token.refreshToken,
      }),
    });

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
      error: undefined,
    };
  } catch {
    // On conserve le token mais on signale l'erreur
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}
