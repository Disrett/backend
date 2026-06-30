'use client';

// =============================================================================
//  Client API — point d'entrée unique vers le backend NestJS
// -----------------------------------------------------------------------------
//  Après migration NextAuth, les tokens JWT backend ne transitent plus par
//  localStorage. Le token d'accès est récupéré depuis la session NextAuth
//  via getSession() — il est stocké dans le JWT NextAuth chiffré (cookie httpOnly).
//
//  Pour les composants React, il est préférable d'utiliser useSession() et de
//  passer le token manuellement, ou de centraliser les appels dans des
//  Server Actions / Route Handlers Next.js (recommandé en production).
// =============================================================================

import { getSession } from 'next-auth/react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Erreur enrichie levée par le client API.
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Wrapper bas niveau autour de fetch.
 *
 * Si auth=true, on récupère le token depuis la session NextAuth (côté client).
 * Le token n'est JAMAIS dans localStorage : il vient du JWT NextAuth déchiffré
 * côté client par next-auth/react, qui le lit depuis le cookie de session.
 *
 * ⚠️ Pour les Server Components / Server Actions, utilisez auth() de NextAuth
 *    et passez le token depuis le callback jwt() — voir auth.js.
 */
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    // getSession() lit le cookie de session NextAuth et retourne le JWT décodé.
    // Le token d'accès backend y est stocké (voir callback jwt() dans auth.js).
    const session = await getSession();
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Impossible de joindre le serveur. Vérifiez que le backend est démarré.',
      0,
      null,
    );
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Erreur ${res.status}`;
    const finalMessage = Array.isArray(message) ? message.join(' · ') : message;
    throw new ApiError(finalMessage, res.status, data);
  }

  return data;
}

// ---------------------------------------------------------------------------
//  AUTH
// ---------------------------------------------------------------------------
export const api = {
  // L'inscription passe directement par fetch dans signup-page.js.
  // La connexion/déconnexion passent par NextAuth (signIn / signOut).

  // POST /api/auth/logout  (Bearer) — appelé par NextAuth signOut si besoin
  logout: () => request('/auth/logout', { method: 'POST', auth: true }),

  // POST /api/auth/refresh  { userId, refreshToken }
  // Géré automatiquement par NextAuth (callback jwt → refreshAccessToken)
  refresh: (userId, refreshToken) =>
    request('/auth/refresh', {
      method: 'POST',
      body: { userId, refreshToken },
    }),

  // -------------------------------------------------------------------------
  //  POSTS / FEED
  // -------------------------------------------------------------------------
  getFeed: (cursor) =>
    request(`/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`),

  createPost: (payload) =>
    request('/posts', { method: 'POST', body: payload, auth: true }),

  deletePost: (id) =>
    request(`/posts/${id}`, { method: 'DELETE', auth: true }),

  likePost: (id) =>
    request(`/posts/${id}/like`, { method: 'POST', auth: true }),

  unlikePost: (id) =>
    request(`/posts/${id}/like`, { method: 'DELETE', auth: true }),

  addComment: (id, content) =>
    request(`/posts/${id}/comments`, {
      method: 'POST',
      body: { content },
      auth: true,
    }),

  // -------------------------------------------------------------------------
  //  USERS
  // -------------------------------------------------------------------------
  getProfile: (username) => request(`/users/${username}`),

  follow: (id) =>
    request(`/users/${id}/follow`, { method: 'POST', auth: true }),

  unfollow: (id) =>
    request(`/users/${id}/follow`, { method: 'DELETE', auth: true }),

  // -------------------------------------------------------------------------
  //  NOTIFICATIONS
  // -------------------------------------------------------------------------
  getNotifications: () => request('/notifications', { auth: true }),

  markAllNotificationsRead: () =>
    request('/notifications/read-all', { method: 'PATCH', auth: true }),

  deleteNotification: (id) =>
    request(`/notifications/${id}`, { method: 'DELETE', auth: true }),
};

export default api;
