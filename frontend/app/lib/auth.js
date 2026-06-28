'use client';

// =============================================================================
//  Gestion des jetons d'authentification (côté navigateur)
// -----------------------------------------------------------------------------
//  Le backend renvoie { accessToken, refreshToken } à l'inscription et à la
//  connexion. On les conserve dans le localStorage pour les rejouer dans le
//  header Authorization des requêtes protégées.
//
//  ⚠️ Note de sécurité (reprise du README backend) : en production, préférez
//  des cookies httpOnly à un stockage localStorage pour limiter le risque XSS.
//  Le localStorage est utilisé ici pour rester simple et sans dépendance.
// =============================================================================

const ACCESS_KEY = 'sl_access_token';
const REFRESH_KEY = 'sl_refresh_token';
const USER_KEY = 'sl_user';

const isBrowser = () => typeof window !== 'undefined';

export function saveTokens({ accessToken, refreshToken }) {
  if (!isBrowser()) return;
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

/** Sauvegarde quelques infos publiques sur l'utilisateur connecté (nom, username...). */
export function saveUser(user) {
  if (!isBrowser() || !user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

/** Efface tous les jetons et infos (déconnexion locale). */
export function clearAuth() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}
