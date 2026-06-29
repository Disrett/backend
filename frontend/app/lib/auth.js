'use client';

/**
 * app/lib/auth.js — Couche de compatibilité et utilitaires d'authentification
 *
 * MIGRATION localStorage → NextAuth (cookies httpOnly)
 *
 * Avant : les tokens JWT étaient stockés dans localStorage, exposés au XSS.
 * Après : NextAuth les stocke dans un cookie httpOnly chiffré, invisible à JS.
 *
 * Ce fichier expose les mêmes fonctions qu'avant pour limiter les changements
 * dans les composants existants, mais redirige vers NextAuth.
 *
 * ⚠️  Les fonctions saveTokens / getAccessToken / getRefreshToken ne font plus
 *     rien côté client : les tokens sont gérés exclusivement par NextAuth.
 *     Pour faire des appels API authentifiés depuis le frontend, utilisez
 *     getAccessToken() qui passe par le token de session NextAuth,
 *     ou mieux : faites les appels via une Route Handler Next.js côté serveur.
 */

import { signIn, signOut } from 'next-auth/react';

// ---------------------------------------------------------------------------
// Stubs de compatibilité (ancienne API localStorage — ne font plus rien)
// Les tokens ne transitent plus jamais par le JS côté client.
// ---------------------------------------------------------------------------

/** @deprecated Géré automatiquement par NextAuth. Ne fait plus rien. */
export function saveTokens() {
  // No-op : NextAuth stocke les tokens dans un cookie httpOnly côté serveur.
}

/** @deprecated Géré automatiquement par NextAuth. Ne fait plus rien. */
export function saveUser() {
  // No-op : utilisez useSession() pour accéder aux infos utilisateur.
}

/** @deprecated Utilisez useSession() de next-auth/react à la place. */
export function getUser() {
  // Retourne null : les infos user sont désormais dans session.user via useSession()
  return null;
}

/** @deprecated Utilisez useSession() de next-auth/react à la place. */
export function isAuthenticated() {
  // Côté client, utilisez useSession() { status === 'authenticated' }
  return false;
}

/** Efface la session (déconnexion via NextAuth). */
export function clearAuth() {
  signOut({ callbackUrl: '/login' });
}

// ---------------------------------------------------------------------------
// Nouvelles fonctions recommandées
// ---------------------------------------------------------------------------

/**
 * Connecte l'utilisateur via NextAuth (credentials provider).
 * Les tokens backend ne transitent JAMAIS par le JS client.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ ok: boolean, error?: string }}
 */
export async function loginWithCredentials(email, password) {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  return {
    ok: result?.ok ?? false,
    error: result?.error ?? null,
  };
}

/**
 * Déconnecte l'utilisateur et redirige vers /login.
 * Invalide le cookie de session NextAuth ET appelle /api/auth/logout backend
 * via une Route Handler si besoin.
 */
export async function logout() {
  await signOut({ callbackUrl: '/login' });
}
