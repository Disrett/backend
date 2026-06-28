'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Search, TrendingUp, Grid, Users, Calendar, Compass, Menu, Settings, FileText, Mail } from 'lucide-react';

export default function Sidebar({ showMenu, setShowMenu }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Accueil', icon: Zap, exact: true },
    { href: '/rechercher', label: 'Rechercher', icon: Search },
    { href: '/actualites', label: 'Actualités', icon: TrendingUp },
    { href: '/categories', label: 'Catégories', icon: Grid },
    { href: '/groupe', label: 'Groupes', icon: Users },
    { href: '/evenements', label: 'Évènements', icon: Calendar },
    { href: '/decouvrir', label: 'Découvrir', icon: Compass },
  ];

  return (
    <div className="hidden lg:flex w-64 bg-gradient-to-br from-[#0047AB] to-[#002d6e] flex-col fixed h-full shadow-xl z-30">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-10 h-10">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#0047AB" strokeWidth="3"/>
              <circle cx="65" cy="25" r="8" fill="#0047AB"/>
              <path d="M 45 35 Q 40 40 35 50 Q 30 65 40 75" stroke="#FFA75F" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 55 30 L 70 45 L 65 50 L 50 40 Z" fill="#0047AB"/>
              <path d="M 50 40 L 45 50 L 55 55 L 60 45 Z" fill="#0047AB"/>
            </svg>
          </div>
          <div className="text-white font-bold text-xl">
            <span>SANS</span>
            <span className="text-[#FFA75F]">Limites</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = href !== '#' && (exact ? pathname === href : pathname.startsWith(href));
          const classes = `flex items-center gap-3 py-4 px-4 text-lg rounded-lg transition-all mb-2 ${
            isActive
              ? 'bg-white/18 text-white font-semibold shadow-md'
              : 'text-white/80 hover:bg-white/10'
          }`;

          if (href === '#') {
            return (
              <a key={label} href="#" className={classes}>
                <Icon size={24} />
                {label}
              </a>
            );
          }

          return (
            <Link key={label} href={href} className={classes}>
              <Icon size={24} />
              {label}
            </Link>
          );
        })}

        <div className="relative mt-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 py-4 px-4 text-lg text-white/80 hover:bg-white/10 rounded-lg transition-all w-full"
          >
            <Menu size={24} />
            Autres
          </button>

          {showMenu && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-xl border-2 border-[#0047AB]/20 overflow-hidden">
              <Link href="/parametres" className="flex items-center gap-3 py-3 px-4 text-[#0047AB] hover:bg-[#0047AB]/10 transition-all">
                <Settings size={20} />
                <span>Paramètres</span>
              </Link>
              <a href="#" className="flex items-center gap-3 py-3 px-4 text-[#0047AB] hover:bg-[#0047AB]/10 transition-all">
                <FileText size={20} />
                <span>Mentions légales</span>
              </a>
              <Link href="/contact" className="flex items-center gap-3 py-3 px-4 text-[#0047AB] hover:bg-[#0047AB]/10 transition-all">
                <Mail size={20} />
                <span>Contact</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
