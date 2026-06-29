/**
 * app/api/auth/[...nextauth]/route.js
 *
 * Point d'entrée Next.js pour toutes les routes NextAuth :
 *   GET/POST /api/auth/signin
 *   GET/POST /api/auth/signout
 *   GET      /api/auth/session
 *   GET      /api/auth/csrf
 *   GET      /api/auth/callback/:provider
 *
 * NextAuth gère automatiquement la protection CSRF sur les routes POST.
 */
import { handlers } from '../../../../auth';

export const { GET, POST } = handlers;
