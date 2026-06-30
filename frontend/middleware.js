/**
 * middleware.js — Protection des routes côté serveur avec NextAuth
 *
 * Ce middleware s'exécute AVANT que Next.js ne serve la page.
 * Il vérifie la session NextAuth (cookie httpOnly) et redirige les
 * utilisateurs non-authentifiés vers /login.
 *
 * Avantages par rapport à une protection côté client :
 * - La page protégée n'est jamais envoyée au navigateur si non-authentifié.
 * - Pas de flash de contenu (la redirection est instantanée, côté Edge).
 * - Impossible à contourner par du JavaScript côté client.
 */

import { auth } from './auth';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuthenticated = !!session;

  // Routes publiques accessibles sans authentification
  const publicPaths = ['/login', '/signup', '/contact', '/hello'];
  const isPublicPath = publicPaths.some(path => 
    nextUrl.pathname === path || nextUrl.pathname.startsWith(path + '/')
  );

  // Routes statiques Next.js (ne pas intercepter)
  if (
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.startsWith('/api/auth') ||
    nextUrl.pathname.startsWith('/public') ||
    nextUrl.pathname.includes('.')
  ) {
    return;
  }

  // Rediriger vers /login si non-authentifié et route protégée
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Rediriger vers / si déjà authentifié et sur une page auth
  if (isAuthenticated && (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup')) {
    return Response.redirect(new URL('/', nextUrl.origin));
  }
});

export const config = {
  // Applique le middleware à toutes les routes sauf les assets statiques
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
