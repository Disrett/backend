'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import Footer from '../components/Footer/Footer';
import { sports } from '../data/sportsData';

export default function CategoriesPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState('');

  const filteredSports = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sports;

    return sports.filter((sport) =>
      [sport.name, sport.tagline, sport.description].join(' ').toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="flex h-screen bg-[#f3f6fb] overflow-hidden">
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      <div className="lg:ml-64 flex-1 flex flex-col w-full" onClick={() => setShowMenu(false)}>
        <Header setShowMobileMenu={setShowMobileMenu} />

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto">
              <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0047AB] via-[#0b2c5d] to-[#FFA75F] p-6 sm:p-8 lg:p-10 text-white shadow-[0_30px_80px_rgba(11,44,93,0.22)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_25%)]" />
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm mb-4">
                    <Sparkles size={16} />
                    Explore les sports de la communauté
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Trouve ta catégorie en un clic</h1>
                  <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
                    Tous les sports disponibles sur Sans Limites, regroupés dans une page claire, visuelle et rapide à parcourir.
                  </p>
                  <div className="mt-8 max-w-2xl mx-auto relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0047AB]/60" size={22} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher un sport, une pratique ou une ambiance..."
                      className="w-full rounded-full border border-white/30 bg-white px-14 py-4 text-[#0b2c5d] text-base sm:text-lg shadow-xl outline-none transition-all focus:ring-4 focus:ring-white/30"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-8 lg:mt-10">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-[#0b2c5d] text-2xl lg:text-3xl font-black">Sports disponibles</h2>
                    <p className="text-[#5d7091] mt-1">Clique sur une catégorie pour découvrir ses événements, ses actus et les comptes à suivre.</p>
                  </div>
                  <div className="hidden md:flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0047AB] shadow-sm border border-[#d6dfef]">
                    {filteredSports.length} catégorie{filteredSports.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                  {filteredSports.map((sport) => (
                    <Link
                      key={sport.slug}
                      href={`/categories/${sport.slug}`}
                      className="group overflow-hidden rounded-[28px] bg-white border border-[#dbe4f2] shadow-[0_18px_40px_rgba(11,44,93,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_rgba(11,44,93,0.16)]"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={sport.image}
                          alt={sport.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${sport.accent} opacity-80`} />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">Sport</p>
                          <h3 className="text-3xl font-black leading-none mt-1">{sport.name}</h3>
                          <p className="mt-2 text-white/85 text-sm sm:text-base">{sport.tagline}</p>
                        </div>
                      </div>

                      <div className="p-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[#0b2c5d] font-bold">{sport.followers} abonnés</p>
                          <p className="text-[#6b7d9b] text-sm mt-1">{sport.activeNow}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#eff5ff] px-4 py-2 text-sm font-semibold text-[#0047AB] transition-colors group-hover:bg-[#0047AB] group-hover:text-white">
                          Voir la page
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredSports.length === 0 && (
                  <div className="mt-10 rounded-[28px] bg-white border border-dashed border-[#c4d2e8] p-10 text-center shadow-sm">
                    <h3 className="text-2xl font-bold text-[#0b2c5d]">Aucune catégorie trouvée</h3>
                    <p className="text-[#6b7d9b] mt-2">Essaie un autre mot-clé pour retrouver le sport que tu cherches.</p>
                  </div>
                )}
              </section>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
