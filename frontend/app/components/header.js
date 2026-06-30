'use client';

import { Bell, Send, Plus, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { clearAuth } from '../lib/auth';

export default function Header({ setShowMobileMenu }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Invalide le refresh token côté serveur (best-effort) ; si non connecté,
    // l'appel échoue silencieusement. clearAuth() déclenche signOut() de NextAuth.
    try {
      await api.logout();
    } catch {
      /* on déconnecte quand même via NextAuth */
    }
    clearAuth();
    router.push('/login');
  };

  const iconButtonClass = (isActive) =>
    `w-11 h-11 lg:w-12 lg:h-12 rounded-full transition-all inline-flex items-center justify-center text-white border border-white/15 ${
      isActive ? 'bg-white/25 shadow-md' : 'hover:bg-white/20 hover:border-white/30'
    }`;

  return (
    <header className="bg-gradient-to-r from-[#0047AB] to-[#FFA75F] px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between sticky top-0 z-20 shadow-lg">
      <button
        onClick={() => setShowMobileMenu(true)}
        className="lg:hidden text-white hover:bg-white/20 p-2 rounded-full transition-all"
      >
        <Menu size={26} />
      </button>

      <div className="lg:hidden flex items-center gap-2">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-8 h-8">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#0047AB" strokeWidth="3"/>
            <circle cx="65" cy="25" r="8" fill="#0047AB"/>
            <path d="M 45 35 Q 40 40 35 50 Q 30 65 40 75" stroke="#FFA75F" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M 55 30 L 70 45 L 65 50 L 50 40 Z" fill="#0047AB"/>
            <path d="M 50 40 L 45 50 L 55 55 L 60 45 Z" fill="#0047AB"/>
          </svg>
        </div>
        <span className="text-white font-bold text-lg">SL</span>
      </div>

      <div className="flex-1 hidden lg:block"></div>
      <div className="flex items-center gap-3 lg:gap-4">
        <Link href="/profil" className={`hidden md:flex items-center gap-3 backdrop-blur-sm rounded-full px-3 lg:px-4 py-2 transition-all ${pathname === '/profil' ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'}`}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#0047AB" strokeWidth="3"/>
              <circle cx="65" cy="25" r="8" fill="#0047AB"/>
              <path d="M 45 35 Q 40 40 35 50 Q 30 65 40 75" stroke="#FFA75F" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 55 30 L 70 45 L 65 50 L 50 40 Z" fill="#0047AB"/>
              <path d="M 50 40 L 45 50 L 55 55 L 60 45 Z" fill="#0047AB"/>
            </svg>
          </div>
          <span className="text-base lg:text-lg font-bold text-white hidden sm:inline">Mon Profil</span>
        </Link>

        <Link href="/notifications" className={iconButtonClass(pathname === '/notifications')} aria-label="Notifications">
          <Bell size={22} className="lg:w-6 lg:h-6" />
        </Link>

        <Link href="/messages" className={iconButtonClass(pathname === '/messages')} aria-label="Messages privés">
          <Send size={22} className="lg:w-6 lg:h-6" />
        </Link>

        <button className="w-11 h-11 lg:w-12 lg:h-12 bg-white hover:bg-white/90 rounded-full transition-all text-[#0047AB] shadow-lg inline-flex items-center justify-center">
          <Plus size={22} className="lg:w-6 lg:h-6" strokeWidth={3} />
        </button>

        <button
          onClick={handleLogout}
          className={iconButtonClass(false)}
          aria-label="Se déconnecter"
          title="Se déconnecter"
        >
          <LogOut size={22} className="lg:w-6 lg:h-6" />
        </button>
      </div>
    </header>
  );
}
