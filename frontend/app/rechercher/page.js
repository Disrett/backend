'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import Footer from '../components/Footer/Footer';
import {
  Search, X, TrendingUp, Clock, Users, Zap, Grid,
  Heart, MessageCircle, Bookmark, UserPlus, Check,
  ChevronRight, Star, Flame, ArrowRight, Filter,
  Hash
} from 'lucide-react';

// ============================================================
// DONNÉES DE RECHERCHE
// ============================================================

const allAthletes = [
  {
    id: 1,
    name: 'Emma Leroy',
    username: '@emma.leroy',
    sport: 'Trail & Running',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaLeroy',
    followers: 8421,
    badge: '🏆',
    coverColor: 'from-violet-500 to-blue-500',
  },
  {
    id: 2,
    name: 'Karim Benali',
    username: '@karim.benali',
    sport: 'CrossFit & Musculation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KarimBenali',
    followers: 12300,
    badge: '🔥',
    coverColor: 'from-orange-500 to-red-500',
  },
  {
    id: 3,
    name: 'Lucie Martin',
    username: '@lucie.swim',
    sport: 'Natation & Triathlon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LucieMartin',
    followers: 5670,
    badge: '🏅',
    coverColor: 'from-cyan-500 to-teal-500',
  },
  {
    id: 4,
    name: 'Théo Gauthier',
    username: '@theo.escalade',
    sport: 'Escalade',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TheoGauthier',
    followers: 3890,
    badge: '🧗',
    coverColor: 'from-stone-500 to-amber-600',
  },
  {
    id: 5,
    name: 'Sofia Reyes',
    username: '@sofia.yoga',
    sport: 'Yoga & Bien-être',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaReyes',
    followers: 21500,
    badge: '🧘',
    coverColor: 'from-pink-400 to-purple-500',
  },
  {
    id: 6,
    name: 'Baptiste Morel',
    username: '@bap.surf',
    sport: 'Surf & Sports Nautiques',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BaptisteMorel',
    followers: 9140,
    badge: '🌊',
    coverColor: 'from-blue-400 to-cyan-400',
  },
  {
    id: 7,
    name: 'Marie Dupont',
    username: '@marie.run',
    sport: 'Marathon & Running',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    followers: 4200,
    badge: '🏃',
    coverColor: 'from-green-400 to-emerald-500',
  },
  {
    id: 8,
    name: 'Lucas Petit',
    username: '@lucas.velo',
    sport: 'Cyclisme',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    followers: 6800,
    badge: '🚴',
    coverColor: 'from-yellow-400 to-orange-500',
  },
];

const allPosts = [
  {
    id: 1,
    author: 'Marie Dupont',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&h=400&fit=crop',
    caption: 'Nouveau record personnel au marathon ! 3h45 💪',
    likes: 1247,
    comments: 89,
    category: 'Running',
    timeAgo: 'Il y a 2h',
  },
  {
    id: 2,
    author: 'Thomas M.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    caption: 'CrossFit Open 2025 — WOD 3 terminé 🔥',
    likes: 834,
    comments: 42,
    category: 'CrossFit',
    timeAgo: 'Il y a 5h',
  },
  {
    id: 3,
    author: 'Sophie B.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=400&fit=crop',
    caption: "Voie 7c+ redpointée, j'y croyais plus 🧗‍♀️",
    likes: 2103,
    comments: 156,
    category: 'Escalade',
    timeAgo: 'Il y a 1j',
  },
  {
    id: 4,
    author: 'Lucas P.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop',
    caption: "100km sous la pluie sans s'arrêter. Rien ne m'arrête.",
    likes: 3451,
    comments: 203,
    category: 'Cyclisme',
    timeAgo: 'Il y a 2j',
  },
  {
    id: 5,
    author: 'Emma V.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop',
    caption: 'Montagne enneigée = bonheur total ❄️',
    likes: 671,
    comments: 34,
    category: 'Montagne',
    timeAgo: 'Il y a 3j',
  },
  {
    id: 6,
    author: 'Nathan G.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
    caption: "Premier triathlon terminé, on recommence quand ? 🏊‍♂️🚴🏃",
    likes: 956,
    comments: 67,
    category: 'Triathlon',
    timeAgo: 'Il y a 4j',
  },
];

const allChallenges = [
  {
    id: 1,
    title: 'Défi 30 jours de course',
    description: 'Courir au moins 5km chaque jour pendant 30 jours consécutifs.',
    participants: 4820,
    icon: '🏃',
    difficulty: 'Intermédiaire',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    category: 'Running',
    daysLeft: 12,
  },
  {
    id: 2,
    title: '100 pompes par jour',
    description: 'Relever le défi des 100 pompes quotidiennes pendant 3 semaines.',
    participants: 7310,
    icon: '💪',
    difficulty: 'Avancé',
    difficultyColor: 'text-red-600 bg-red-50',
    category: 'Musculation',
    daysLeft: 5,
  },
  {
    id: 3,
    title: 'Méditation matinale',
    description: '10 minutes de méditation chaque matin pour booster ta journée.',
    participants: 3200,
    icon: '🧘',
    difficulty: 'Débutant',
    difficultyColor: 'text-green-600 bg-green-50',
    category: 'Bien-être',
    daysLeft: 20,
  },
  {
    id: 4,
    title: 'Cyclisme 200km/mois',
    description: 'Parcourir au moins 200km à vélo sur le mois en cours.',
    participants: 2140,
    icon: '🚴',
    difficulty: 'Intermédiaire',
    difficultyColor: 'text-yellow-600 bg-yellow-50',
    category: 'Cyclisme',
    daysLeft: 8,
  },
  {
    id: 5,
    title: 'Natation 10km',
    description: 'Nager 10km cumulés en moins d\'un mois.',
    participants: 1580,
    icon: '🏊',
    difficulty: 'Avancé',
    difficultyColor: 'text-red-600 bg-red-50',
    category: 'Natation',
    daysLeft: 15,
  },
];

const allCategories = [
  { id: 1, name: 'Running', icon: '🏃', members: 18400, color: 'from-green-400 to-emerald-500', posts: 2340 },
  { id: 2, name: 'Cyclisme', icon: '🚴', members: 12100, color: 'from-yellow-400 to-orange-400', posts: 1870 },
  { id: 3, name: 'CrossFit', icon: '🏋️', members: 9800, color: 'from-red-500 to-orange-500', posts: 1450 },
  { id: 4, name: 'Natation', icon: '🏊', members: 7200, color: 'from-blue-400 to-cyan-500', posts: 980 },
  { id: 5, name: 'Escalade', icon: '🧗', members: 5600, color: 'from-stone-400 to-amber-500', posts: 760 },
  { id: 6, name: 'Trail', icon: '⛰️', members: 8900, color: 'from-violet-400 to-purple-500', posts: 1230 },
  { id: 7, name: 'Yoga', icon: '🧘', members: 11300, color: 'from-pink-400 to-rose-400', posts: 1560 },
  { id: 8, name: 'Surf', icon: '🏄', members: 4300, color: 'from-cyan-400 to-teal-500', posts: 620 },
];

const trendingSearches = [
  'marathon paris 2025', 'crossfit wod', 'trail running', 'défi 30 jours',
  'escalade fontainebleau', 'triathlon ironman', 'yoga matin', 'vélo gravel'
];

const INITIAL_RECENT = ['Emma Leroy', 'Cyclisme 200km', 'Trail Running'];

const TABS = ['Tout', 'Athlètes', 'Publications', 'Défis', 'Catégories'];

// ============================================================
// SOUS-COMPOSANTS
// ============================================================

function AthleteResult({ athlete }) {
  const [followed, setFollowed] = useState(false);
  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all">
      <div className={`relative shrink-0`}>
        <img src={athlete.avatar} alt={athlete.name} className="w-12 h-12 rounded-full ring-2 ring-gray-100" />
        <span className="absolute -top-1 -right-1 text-base">{athlete.badge}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm truncate">{athlete.name}</p>
        <p className="text-xs text-gray-400 truncate">{athlete.username}</p>
        <p className="text-xs text-[#0047AB] font-medium mt-0.5">{athlete.sport}</p>
      </div>
      <div className="text-right shrink-0 mr-3 hidden sm:block">
        <p className="text-sm font-bold text-gray-800">{fmt(athlete.followers)}</p>
        <p className="text-xs text-gray-400">abonnés</p>
      </div>
      <button
        onClick={() => setFollowed(!followed)}
        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          followed
            ? 'bg-gray-100 text-gray-600 border border-gray-200'
            : 'bg-[#0047AB] text-white hover:bg-[#FFA75F]'
        }`}
      >
        {followed ? <><Check size={12} /> Abonné</> : <><UserPlus size={12} /> Suivre</>}
      </button>
    </div>
  );
}

function PostResult({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="flex gap-4 p-4">
        <img
          src={post.image}
          alt={post.caption}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <img src={post.avatar} alt={post.author} className="w-5 h-5 rounded-full" />
            <span className="text-xs font-semibold text-gray-700">{post.author}</span>
            <span className="text-xs text-gray-400">· {post.timeAgo}</span>
            <span className="ml-auto text-xs bg-[#0047AB]/10 text-[#0047AB] font-semibold px-2 py-0.5 rounded-full">
              {post.category}
            </span>
          </div>
          <p className="text-sm text-gray-800 line-clamp-2 mb-3">{post.caption}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
              {fmt(post.likes + (liked ? 1 : 0))}
            </button>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <MessageCircle size={13} />
              {fmt(post.comments)}
            </span>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex items-center gap-1.5 text-xs font-medium ml-auto transition-colors ${saved ? 'text-[#FFA75F]' : 'text-gray-400 hover:text-[#FFA75F]'}`}
            >
              <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengeResult({ challenge }) {
  const [joined, setJoined] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#FFA75F] flex items-center justify-center text-2xl shrink-0">
        {challenge.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm truncate">{challenge.title}</p>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{challenge.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${challenge.difficultyColor}`}>
            {challenge.difficulty}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Users size={11} />
            {challenge.participants.toLocaleString()}
          </span>
          <span className="text-xs text-[#FFA75F] font-medium">{challenge.daysLeft}j restants</span>
        </div>
      </div>
      <button
        onClick={() => setJoined(!joined)}
        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          joined
            ? 'bg-gray-100 text-gray-600 border border-gray-200'
            : 'bg-gradient-to-r from-[#0047AB] to-[#FFA75F] text-white'
        }`}
      >
        {joined ? <><Check size={12} /> Rejoint</> : <><Zap size={12} /> Rejoindre</>}
      </button>
    </div>
  );
}

function CategoryResult({ cat }) {
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${cat.color} text-white flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer`}>
      <span className="text-3xl">{cat.icon}</span>
      <div className="flex-1">
        <p className="font-bold text-base">{cat.name}</p>
        <p className="text-xs text-white/80">{cat.members.toLocaleString()} membres · {cat.posts.toLocaleString()} posts</p>
      </div>
      <ChevronRight size={20} className="text-white/70" />
    </div>
  );
}

function EmptyState({ query }) {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Aucun résultat pour « {query} »
      </h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto">
        Essaie avec d'autres mots-clés ou explore les tendances ci-dessous.
      </p>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function RecherchePage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tout');
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Focus auto à l'ouverture
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const hasQuery = query.trim().length > 0;

  // Filtrage des résultats
  const results = useMemo(() => {
    if (!hasQuery) return { athletes: [], posts: [], challenges: [], categories: [] };
    const q = query.toLowerCase();
    return {
      athletes: allAthletes.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.sport.toLowerCase().includes(q)
      ),
      posts: allPosts.filter(p =>
        p.caption.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ),
      challenges: allChallenges.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      ),
      categories: allCategories.filter(c =>
        c.name.toLowerCase().includes(q)
      ),
    };
  }, [query, hasQuery]);

  const totalResults = results.athletes.length + results.posts.length + results.challenges.length + results.categories.length;

  const handleSearch = (term) => {
    setQuery(term);
    if (term.trim() && !recentSearches.includes(term.trim())) {
      setRecentSearches(prev => [term.trim(), ...prev].slice(0, 5));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  };

  const clearRecent = (term) => {
    setRecentSearches(prev => prev.filter(s => s !== term));
  };

  // Filtrage par onglet
  const showAthletes = activeTab === 'Tout' || activeTab === 'Athlètes';
  const showPosts = activeTab === 'Tout' || activeTab === 'Publications';
  const showChallenges = activeTab === 'Tout' || activeTab === 'Défis';
  const showCategories = activeTab === 'Tout' || activeTab === 'Catégories';

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
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

          {/* ─── HERO BARRE DE RECHERCHE ─── */}
          <div className="bg-gradient-to-r from-[#0047AB] to-[#FFA75F] px-4 pt-8 pb-0">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Search size={28} className="text-white/90" />
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Rechercher</h1>
              </div>
              <p className="text-white/80 text-sm text-center mb-5">
                Athlètes, publications, défis, catégories… tout est ici.
              </p>

              {/* Champ de recherche */}
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Rechercher sur SANSLimites..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                  className="w-full pl-12 pr-12 py-4 rounded-t-2xl bg-white text-gray-800 placeholder-gray-400 text-base focus:outline-none shadow-xl font-medium"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Onglets (collés à la barre) */}
              {hasQuery && (
                <div className="flex gap-1 bg-white px-3 pt-2 pb-0 overflow-x-auto no-scrollbar border-b border-gray-100">
                  {TABS.map((tab) => {
                    const count = tab === 'Tout' ? totalResults
                      : tab === 'Athlètes' ? results.athletes.length
                      : tab === 'Publications' ? results.posts.length
                      : tab === 'Défis' ? results.challenges.length
                      : results.categories.length;

                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`shrink-0 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                          activeTab === tab
                            ? 'border-[#0047AB] text-[#0047AB] bg-[#0047AB]/5'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab}
                        {count > 0 && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                            activeTab === tab ? 'bg-[#0047AB] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-6">

            {/* ─── ÉTAT VIDE : pas de recherche ─── */}
            {!hasQuery && (
              <div className="space-y-8">

                {/* Recherches récentes */}
                {recentSearches.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        Recherches récentes
                      </h2>
                      <button
                        onClick={() => setRecentSearches([])}
                        className="text-xs text-[#0047AB] font-semibold hover:text-[#FFA75F] transition-colors"
                      >
                        Tout effacer
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#0047AB]/30 hover:shadow-sm transition-all group cursor-pointer"
                          onClick={() => setQuery(term)}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Clock size={14} className="text-gray-400" />
                          </div>
                          <span className="flex-1 text-sm text-gray-700 font-medium">{term}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); clearRecent(term); }}
                            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Tendances */}
                <section>
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-[#FFA75F]" />
                    Tendances du moment
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium hover:border-[#0047AB] hover:text-[#0047AB] hover:shadow-sm transition-all"
                      >
                        <Hash size={12} className="text-[#FFA75F]" />
                        {term}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Catégories populaires */}
                <section>
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <Grid size={16} className="text-[#0047AB]" />
                    Catégories populaires
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {allCategories.slice(0, 8).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setQuery(cat.name)}
                        className={`rounded-2xl p-4 bg-gradient-to-br ${cat.color} text-white flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all`}
                      >
                        <span className="text-3xl">{cat.icon}</span>
                        <span className="text-sm font-bold">{cat.name}</span>
                        <span className="text-xs text-white/80">{(cat.members / 1000).toFixed(1)}k membres</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Athlètes suggérés */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                      <Star size={16} className="text-[#FFA75F] fill-[#FFA75F]" />
                      Athlètes suggérés
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {allAthletes.slice(0, 4).map((athlete) => (
                      <AthleteResult key={athlete.id} athlete={athlete} />
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* ─── RÉSULTATS ─── */}
            {hasQuery && totalResults === 0 && (
              <EmptyState query={query} />
            )}

            {hasQuery && totalResults > 0 && (
              <div className="space-y-8">

                {/* Résumé */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Filter size={14} />
                  <span>
                    <strong className="text-gray-800">{totalResults}</strong> résultat{totalResults > 1 ? 's' : ''} pour
                    {' '}<strong className="text-[#0047AB]">« {query} »</strong>
                  </span>
                </div>

                {/* Athlètes */}
                {showAthletes && results.athletes.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-3">
                      <Users size={16} className="text-[#0047AB]" />
                      Athlètes
                      <span className="text-xs bg-[#0047AB]/10 text-[#0047AB] px-2 py-0.5 rounded-full font-bold">{results.athletes.length}</span>
                    </h2>
                    <div className="space-y-2">
                      {results.athletes.map(a => <AthleteResult key={a.id} athlete={a} />)}
                    </div>
                  </section>
                )}

                {/* Publications */}
                {showPosts && results.posts.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-3">
                      <Flame size={16} className="text-[#FFA75F]" />
                      Publications
                      <span className="text-xs bg-[#FFA75F]/20 text-[#FFA75F] px-2 py-0.5 rounded-full font-bold">{results.posts.length}</span>
                    </h2>
                    <div className="space-y-2">
                      {results.posts.map(p => <PostResult key={p.id} post={p} />)}
                    </div>
                  </section>
                )}

                {/* Défis */}
                {showChallenges && results.challenges.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-3">
                      <Zap size={16} className="text-[#0047AB]" />
                      Défis
                      <span className="text-xs bg-[#0047AB]/10 text-[#0047AB] px-2 py-0.5 rounded-full font-bold">{results.challenges.length}</span>
                    </h2>
                    <div className="space-y-2">
                      {results.challenges.map(c => <ChallengeResult key={c.id} challenge={c} />)}
                    </div>
                  </section>
                )}

                {/* Catégories */}
                {showCategories && results.categories.length > 0 && (
                  <section>
                    <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-3">
                      <Grid size={16} className="text-[#0047AB]" />
                      Catégories
                      <span className="text-xs bg-[#0047AB]/10 text-[#0047AB] px-2 py-0.5 rounded-full font-bold">{results.categories.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.categories.map(c => <CategoryResult key={c.id} cat={c} />)}
                    </div>
                  </section>
                )}

              </div>
            )}

          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
