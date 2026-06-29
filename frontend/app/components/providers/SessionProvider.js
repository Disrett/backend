'use client';

/**
 * app/components/providers/SessionProvider.js
 *
 * Wrapper client-only pour le SessionProvider de NextAuth.
 * Nécessaire car le layout.js est un Server Component.
 * Il expose le hook useSession() à tous les composants enfants.
 */
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
