'use client';

// =============================================================================
//  Client API — point d'entrée unique vers le backend NestJS
// -----------------------------------------------------------------------------
//  Toutes les requêtes HTTP vers le backend passent par ici. Avantages :
//   - un seul endroit où gérer l'URL de base, les en-têtes et les erreurs ;
//   - le jeton d'accès (JWT) est injecté automatiquement sur les routes
//     protégées ;
//   - les composants/pages restent lisibles (ils appellent api.login(), etc.).
//
//  La forme des réponses correspond au contrat décrit dans le README backend
//  (section « Routes déjà disponibles »).
// =============================================================================

import { getAccessToken } from './auth';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Erreur enrichie levée par le client API.
 * `status` = code HTTP, `data` = corps JSON renvoyé par le backend (s'il existe).
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
 * @param {string} path  ex: '/auth/login'
 * @param {object} options { method, body, auth }
 */
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Routes protégées : on ajoute le Bearer token s'il existe.
  if (auth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    // Backend injoignable (non démarré, mauvais port, CORS bloqué...).
    throw new ApiError(
      'Impossible de joindre le serveur. Vérifiez que le backend est démarré.',
      0,
      null,
    );
  }

  // Réponses sans corps (204, etc.)
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
    // NestJS renvoie parfois message sous forme de tableau (validation).
    const finalMessage = Array.isArray(message) ? message.join(' · ') : message;
    throw new ApiError(finalMessage, res.status, data);
  }

  return data;
}

// ---------------------------------------------------------------------------
//  AUTH
// ---------------------------------------------------------------------------
export const api = {
  // POST /api/auth/register  { email, password, username, name }
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: payload }),

  // POST /api/auth/login  { email, password }
  login: (payload) =>
    request('/auth/login', { method: 'POST', body: payload }),

  // POST /api/auth/logout  (Bearer)
  logout: () => request('/auth/logout', { method: 'POST', auth: true }),

  // POST /api/auth/refresh  { userId, refreshToken }
  refresh: (userId, refreshToken) =>
    request('/auth/refresh', {
      method: 'POST',
      body: { userId, refreshToken },
    }),

  // -------------------------------------------------------------------------
  //  POSTS / FEED
  // -------------------------------------------------------------------------
  // GET /api/posts?cursor=...
  getFeed: (cursor) =>
    request(`/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`),

  // POST /api/posts  (Bearer)  { title?, content?, imageUrl?, sportId? }
  createPost: (payload) =>
    request('/posts', { method: 'POST', body: payload, auth: true }),

  // DELETE /api/posts/:id  (Bearer)
  deletePost: (id) =>
    request(`/posts/${id}`, { method: 'DELETE', auth: true }),

  // POST /api/posts/:id/like  (Bearer)
  likePost: (id) =>
    request(`/posts/${id}/like`, { method: 'POST', auth: true }),

  // DELETE /api/posts/:id/like  (Bearer)
  unlikePost: (id) =>
    request(`/posts/${id}/like`, { method: 'DELETE', auth: true }),

  // POST /api/posts/:id/comments  (Bearer)  { content }
  addComment: (id, content) =>
    request(`/posts/${id}/comments`, {
      method: 'POST',
      body: { content },
      auth: true,
    }),

  // -------------------------------------------------------------------------
  //  USERS
  // -------------------------------------------------------------------------
  // GET /api/users/:username
  getProfile: (username) => request(`/users/${username}`),

  // POST /api/users/:id/follow  (Bearer)
  follow: (id) =>
    request(`/users/${id}/follow`, { method: 'POST', auth: true }),

  // DELETE /api/users/:id/follow  (Bearer)
  unfollow: (id) =>
    request(`/users/${id}/follow`, { method: 'DELETE', auth: true }),

  // -------------------------------------------------------------------------
  //  NOTIFICATIONS
  // -------------------------------------------------------------------------
  // GET /api/notifications  (Bearer)
  getNotifications: () => request('/notifications', { auth: true }),

  // PATCH /api/notifications/read-all  (Bearer)
  markAllNotificationsRead: () =>
    request('/notifications/read-all', { method: 'PATCH', auth: true }),

  // DELETE /api/notifications/:id  (Bearer)
  deleteNotification: (id) =>
    request(`/notifications/${id}`, { method: 'DELETE', auth: true }),
};

export default api;
