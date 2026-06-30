'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, BellPlus, Heart, Newspaper, Star, TrendingUp, Users } from 'lucide-react';
import Sidebar from '../../components/sidebar';
import MobileMenu from '../../components/mobilemenu';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';
import { getSportBySlug, sports } from '../../data/sportsData';

export default function SportDetailPage() {
  const params = useParams();
  const sport = useMemo(() => getSportBySlug(params.slug), [params.slug]);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!sport) {
    return (
      <div className="min-h-screen bg-[#f3f6fb] flex items-center justify-center p-6">
        <div className="rounded-[28px] bg-white border border-[#dbe4f2] p-8 text-center shadow-[0_18px_40px_rgba(11,44,93,0.08)]">
          <h1 className="text-3xl font-black text-[#0b2c5d]">Sport introuvable</h1>
          <p className="mt-2 text-[#6e7f9c]">La catégorie demandée n’existe pas encore.</p>
          <Link href="/categories" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0047AB] px-5 py-3 text-white font-semibold">
            <ArrowLeft size={16} />
            Retour aux catégories
          </Link>
        </div>
      </div>
    );
  }

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
            <div className="max-w-7xl mx-auto space-y-8">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#0047AB] border border-[#d6dfef] shadow-sm hover:bg-[#0047AB] hover:text-white transition-all"
              >
                <ArrowLeft size={16} />
                Retour aux catégories
              </Link>

              <section className="overflow-hidden rounded-[34px] bg-white border border-[#dbe4f2] shadow-[0_30px_70px_rgba(11,44,93,0.12)]">
                <div className="relative min-h-[360px] lg:min-h-[420px]">
                  <img src={sport.image} alt={sport.name} className="absolute inset-0 h-full w-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${sport.accent} opacity-85`} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.55))]" />

                  <div className="relative z-10 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-white">
                    <div className="flex items-start justify-between gap-5 flex-wrap">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-white/75 font-semibold">Catégorie sport</p>
                        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">{sport.name}</h1>
                        <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed">{sport.description}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => setIsFollowing((prev) => !prev)}
                          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold transition-all ${
                            isFollowing ? 'bg-white text-[#0047AB]' : 'bg-[#0047AB]/55 border border-white/25 text-white backdrop-blur-sm hover:bg-white/15'
                          }`}
                        >
                          <BellPlus size={18} />
                          {isFollowing ? 'Page suivie' : 'Suivre la page'}
                        </button>
                        <button
                          onClick={() => setIsFavorite((prev) => !prev)}
                          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold transition-all ${
                            isFavorite ? 'bg-[#FFA75F] text-white' : 'bg-white/12 border border-white/25 text-white backdrop-blur-sm hover:bg-white/18'
                          }`}
                        >
                          <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                          {isFavorite ? 'Ajouté aux favoris' : 'Mettre en favori'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-4xl">
                      {[
                        { label: 'Abonnés', value: sport.followers },
                        { label: 'Actifs en ce moment', value: sport.activeNow },
                        { label: 'Événements de la semaine', value: `${sport.featuredEvents.length}+` },
                        { label: 'Comptes à suivre', value: `${sport.influencers.length}+` },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[24px] bg-white/14 backdrop-blur-md px-4 py-4 border border-white/15">
                          <p className="text-sm text-white/70">{item.label}</p>
                          <p className="mt-1 text-2xl font-black">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
                <div className="space-y-6">
                  <div className="rounded-[30px] bg-white border border-[#dbe4f2] p-6 shadow-[0_18px_40px_rgba(11,44,93,0.08)]">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#eff5ff] text-[#0047AB] flex items-center justify-center">
                        <TrendingUp size={22} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-[#0b2c5d]">Événements à la une</h2>
                        <p className="text-[#6b7d9b]">Ce qui rassemble la communauté {sport.name.toLowerCase()} en ce moment.</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {sport.featuredEvents.map((event) => (
                        <article key={event.title} className="overflow-hidden rounded-[24px] border border-[#d6dfef] bg-[#f9fbff]">
                          <div className="h-44 overflow-hidden">
                            <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB]">Événement</p>
                            <h3 className="mt-2 text-xl font-black text-[#0b2c5d] leading-tight">{event.title}</h3>
                            <p className="mt-3 text-[#5c6f90]">{event.date}</p>
                            <p className="text-[#5c6f90]">{event.place}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[30px] bg-white border border-[#dbe4f2] p-6 shadow-[0_18px_40px_rgba(11,44,93,0.08)]">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#fff3ea] text-[#ff7700] flex items-center justify-center">
                        <Newspaper size={22} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-[#0b2c5d]">Actualités & tendances</h2>
                        <p className="text-[#6b7d9b]">Ce qu'il se passe en ce moment autour du {sport.name.toLowerCase()}.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {sport.news.map((item, index) => (
                        <div key={item} className="flex items-start gap-4 rounded-[22px] border border-[#e4ebf7] bg-[#f8fbff] p-4">
                          <div className="w-10 h-10 rounded-full bg-white text-[#0047AB] border border-[#d6dfef] flex items-center justify-center font-black shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-[#102749] text-base leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[30px] bg-white border border-[#dbe4f2] p-6 shadow-[0_18px_40px_rgba(11,44,93,0.08)]">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#eff5ff] text-[#0047AB] flex items-center justify-center">
                        <Users size={22} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-[#0b2c5d]">Comptes & influenceurs</h2>
                        <p className="text-[#6b7d9b]">Les profils les plus actifs et suivis dans cette catégorie.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {sport.influencers.map((profile) => (
                        <div key={profile.name} className="flex items-center justify-between gap-4 rounded-[22px] border border-[#e4ebf7] bg-[#f8fbff] px-4 py-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <img src={profile.image} alt={profile.name} className="w-14 h-14 rounded-full border border-[#d6dfef] bg-white object-cover" />
                            <div className="min-w-0">
                              <p className="font-black text-[#0b2c5d] text-lg truncate">{profile.name}</p>
                              <p className="text-[#6b7d9b] truncate">{profile.specialty}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-[#0047AB]">{profile.followers}</p>
                            <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#0047AB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b2c5d] transition-colors">
                              <Heart size={14} />
                              Suivre
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[30px] bg-gradient-to-br from-[#0b2c5d] to-[#0047AB] p-6 text-white shadow-[0_22px_50px_rgba(11,44,93,0.18)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/65 font-semibold">Explorer encore</p>
                    <h3 className="mt-3 text-2xl font-black">Découvre aussi d'autres sports</h3>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {sports
                        .filter((item) => item.slug !== sport.slug)
                        .slice(0, 6)
                        .map((item) => (
                          <Link
                            key={item.slug}
                            href={`/categories/${item.slug}`}
                            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#0047AB]"
                          >
                            {item.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
