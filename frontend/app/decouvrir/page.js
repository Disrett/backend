'use client';

import { useState, useMemo } from 'react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import Footer from '../components/Footer/Footer';
import {
  Search, Compass, TrendingUp, MapPin, Users, Heart, Zap,
  ChevronRight, Star, Flame, Trophy, UserPlus, Check,
  Bike, Dumbbell, Wind, Waves, Mountain, Target, Activity,
  ArrowRight, Play, Bookmark, MessageCircle
} from 'lucide-react';

// ============================================================
// DONNÉES : ATHLÈTES À SUIVRE
// ============================================================
const suggestedAthletes = [
  {
    id: 1,
    name: 'Emma Leroy',
    username: '@emma.leroy',
    sport: 'Trail & Running',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaLeroy',
    followers: 8421,
    posts: 214,
    badge: '🏆',
    badgeLabel: 'Top Traileuse',
    mutualFollowers: 3,
    coverColor: 'from-violet-500 to-blue-500',
    recentActivity: 'Trail de 32km ce matin 🏔️',
  },
  {
    id: 2,
    name: 'Karim Benali',
    username: '@karim.benali',
    sport: 'CrossFit & Musculation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KarimBenali',
    followers: 12300,
    posts: 387,
    badge: '🔥',
    badgeLabel: 'Coach Certifié',
    mutualFollowers: 7,
    coverColor: 'from-orange-500 to-red-500',
    recentActivity: 'PR au squat : 180kg 💪',
  },
  {
    id: 3,
    name: 'Lucie Martin',
    username: '@lucie.swim',
    sport: 'Natation & Triathlon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LucieMartin',
    followers: 5670,
    posts: 142,
    badge: '🏅',
    badgeLabel: 'Finisher Ironman',
    mutualFollowers: 2,
    coverColor: 'from-cyan-500 to-teal-500',
    recentActivity: '3km en piscine ce matin 🌊',
  },
  {
    id: 4,
    name: 'Théo Gauthier',
    username: '@theo.escalade',
    sport: 'Escalade',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TheoGauthier',
    followers: 3890,
    posts: 98,
    badge: '🧗',
    badgeLabel: 'Grimpeur Elite',
    mutualFollowers: 5,
    coverColor: 'from-stone-500 to-amber-600',
    recentActivity: 'Voie 8a redpointée ! 🎉',
  },
  {
    id: 5,
    name: 'Sofia Reyes',
    username: '@sofia.yoga',
    sport: 'Yoga & Bien-être',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaReyes',
    followers: 21500,
    posts: 631,
    badge: '🧘',
    badgeLabel: 'Instructrice Yoga',
    mutualFollowers: 9,
    coverColor: 'from-pink-400 to-purple-500',
    recentActivity: 'Flow du matin avec 200 personnes ☀️',
  },
  {
    id: 6,
    name: 'Baptiste Morel',
    username: '@bap.surf',
    sport: 'Surf & Sports Nautiques',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BaptisteMorel',
    followers: 9140,
    posts: 276,
    badge: '🌊',
    badgeLabel: 'Surfeur Pro',
    mutualFollowers: 1,
    coverColor: 'from-blue-400 to-cyan-400',
    recentActivity: 'Hossegor : vagues parfaites 🏄',
  },
];

// ============================================================
// DONNÉES : DÉFIS EN TENDANCE
// ============================================================
const trendingChallenges = [
  {
    id: 1,
    title: 'Défi 30 jours de course',
    description: 'Courir au moins 5km chaque jour pendant 30 jours consécutifs.',
    participants: 4820,
    icon: '🏃',
    difficulty: 'Intermédiaire',
    difficultyColor: 'bg-yellow-100 text-yellow-700',
    category: 'Running',
    trend: '+234 cette semaine',
    daysLeft: 12,
    gradient: 'from-[#0047AB] to-[#003d94]',
  },
  {
    id: 2,
    title: '100 pompes par jour',
    description: 'Relever le défi des 100 pompes quotidiennes pendant 3 semaines.',
    participants: 7310,
    icon: '💪',
    difficulty: 'Avancé',
    difficultyColor: 'bg-red-100 text-red-700',
    category: 'Musculation',
    trend: '+891 cette semaine',
    daysLeft: 5,
    gradient: 'from-[#FFA75F] to-[#ff8c2e]',
  },
  {
    id: 3,
    title: 'Méditation matinale',
    description: '10 minutes de méditation chaque matin pour booster ta journée.',
    participants: 3200,
    icon: '🧘',
    difficulty: 'Débutant',
    difficultyColor: 'bg-green-100 text-green-700',
    category: 'Bien-être',
    trend: '+156 cette semaine',
    daysLeft: 20,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 4,
    title: 'Cyclisme 200km/mois',
    description: 'Parcourir au moins 200km à vélo sur le mois en cours.',
    participants: 2140,
    icon: '🚴',
    difficulty: 'Intermédiaire',
    difficultyColor: 'bg-yellow-100 text-yellow-700',
    category: 'Cyclisme',
    trend: '+312 cette semaine',
    daysLeft: 8,
    gradient: 'from-emerald-500 to-teal-500',
  },
];

// ============================================================
// DONNÉES : POSTS POPULAIRES (grille)
// ============================================================
const popularPosts = [
  {
    id: 1,
    author: 'Marie Dupont',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&h=600&fit=crop',
    caption: 'Nouveau record personnel au marathon ! 3h45 💪',
    likes: 1247,
    comments: 89,
    category: 'Running',
    size: 'large',
  },
  {
    id: 2,
    author: 'Thomas M.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    caption: 'CrossFit Open 2025 - WOD 3 terminé 🔥',
    likes: 834,
    comments: 42,
    category: 'CrossFit',
    size: 'small',
  },
  {
    id: 3,
    author: 'Sophie B.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=400&fit=crop',
    caption: 'Voie 7c+ redpointée, j\'y croyais plus 🧗‍♀️',
    likes: 2103,
    comments: 156,
    category: 'Escalade',
    size: 'small',
  },
  {
    id: 4,
    author: 'Lucas P.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop',
    caption: '100km sous la pluie sans s\'arrêter. Rien ne m\'arrête.',
    likes: 3451,
    comments: 203,
    category: 'Cyclisme',
    size: 'large',
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
    size: 'small',
  },
  {
    id: 6,
    author: 'Nathan G.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
    caption: 'Premier triathlon terminé, on recommence quand ? 🏊‍♂️🚴🏃',
    likes: 956,
    comments: 67,
    category: 'Triathlon',
    size: 'small',
  },
];

// ============================================================
// DONNÉES : SPORTS À DÉCOUVRIR
// ============================================================
const sportsToDiscover = [
  {
    id: 1,
    name: 'Padel',
    description: 'Le sport raquette qui fait fureur. Accessible, social et addictif.',
    icon: <Target size={28} className="text-white" />,
    color: 'from-[#0047AB] to-[#003580]',
    practitioners: '850K pratiquants en France',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=200&fit=crop',
    tag: '🔥 Tendance',
  },
  {
    id: 2,
    name: 'Calisthenics',
    description: 'La force au poids du corps. Partout, sans salle, sans équipement.',
    icon: <Dumbbell size={28} className="text-white" />,
    color: 'from-[#FFA75F] to-[#ff8c2e]',
    practitioners: '320K pratiquants en France',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    tag: '💪 Force & Style',
  },
  {
    id: 3,
    name: 'Freediving',
    description: 'Apnée sportive : explore l\'océan en retenant ton souffle.',
    icon: <Waves size={28} className="text-white" />,
    color: 'from-cyan-500 to-blue-600',
    practitioners: '42K pratiquants en France',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop',
    tag: '🌊 Sensation',
  },
  {
    id: 4,
    name: 'Bikepack',
    description: 'Partir à l\'aventure à vélo avec tout ton matériel. Liberté totale.',
    icon: <Bike size={28} className="text-white" />,
    color: 'from-emerald-500 to-green-600',
    practitioners: '180K pratiquants en France',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=200&fit=crop',
    tag: '🏕️ Aventure',
  },
];

// ============================================================
// DONNÉES : SPOTS SPORTIFS
// ============================================================
const sportSpots = [
  {
    id: 1,
    name: 'Forêt de Fontainebleau',
    type: 'Escalade • Bloc',
    location: 'Seine-et-Marne, IDF',
    rating: 4.9,
    checkins: 3240,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
    tags: ['Escalade', 'Trail', 'Famille'],
  },
  {
    id: 2,
    name: 'Lac d\'Annecy',
    type: 'Nautique • Running',
    location: 'Haute-Savoie',
    rating: 4.8,
    checkins: 2870,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=250&fit=crop',
    tags: ['Paddle', 'Natation', 'Running'],
  },
  {
    id: 3,
    name: 'Massif des Vosges',
    type: 'Trail • Randonnée',
    location: 'Grand Est',
    rating: 4.7,
    checkins: 1920,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop',
    tags: ['Trail', 'VTT', 'Ski nordique'],
  },
  {
    id: 4,
    name: 'Plage d\'Hossegor',
    type: 'Surf • Kitesurf',
    location: 'Landes',
    rating: 4.9,
    checkins: 4100,
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=250&fit=crop',
    tags: ['Surf', 'Kite', 'Côte'],
  },
];

// ============================================================
// COMPOSANT : Carte Athlète
// ============================================================
function AthleteCard({ athlete }) {
  const [followed, setFollowed] = useState(false);

  const formatFollowers = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
      {/* Cover */}
      <div className={`h-20 bg-gradient-to-r ${athlete.coverColor} relative`}>
        <div className="absolute -bottom-6 left-4">
          <div className="relative">
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="w-14 h-14 rounded-full ring-4 ring-white"
            />
            <span className="absolute -top-1 -right-1 text-lg">{athlete.badge}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 px-4 pb-4 flex-1 flex flex-col">
        <div className="mb-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{athlete.name}</h3>
          <p className="text-xs text-gray-400">{athlete.username}</p>
        </div>

        <span className="inline-block bg-[#0047AB]/10 text-[#0047AB] text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-2">
          {athlete.badgeLabel}
        </span>

        <p className="text-xs text-gray-500 mb-3 italic line-clamp-2">"{athlete.recentActivity}"</p>

        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span><strong className="text-gray-800">{formatFollowers(athlete.followers)}</strong> abonnés</span>
          <span><strong className="text-gray-800">{athlete.posts}</strong> posts</span>
        </div>

        {athlete.mutualFollowers > 0 && (
          <p className="text-xs text-[#FFA75F] font-medium mb-3">
            👥 {athlete.mutualFollowers} abonné{athlete.mutualFollowers > 1 ? 's' : ''} en commun
          </p>
        )}

        <button
          onClick={() => setFollowed(!followed)}
          className={`w-full py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all mt-auto ${
            followed
              ? 'bg-gray-100 text-gray-600 border border-gray-200'
              : 'bg-[#0047AB] text-white hover:bg-[#FFA75F]'
          }`}
        >
          {followed ? <><Check size={14} /> Abonné</> : <><UserPlus size={14} /> Suivre</>}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : Carte Défi
// ============================================================
function ChallengeCard({ challenge }) {
  const [joined, setJoined] = useState(false);

  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${challenge.gradient} text-white relative overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-6 -translate-x-6" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{challenge.icon}</span>
          <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
            {challenge.daysLeft}j restants
          </span>
        </div>

        <h3 className="font-bold text-base leading-tight mb-1">{challenge.title}</h3>
        <p className="text-xs text-white/80 mb-3 line-clamp-2">{challenge.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <Users size={12} />
            <span>{challenge.participants.toLocaleString()} participants</span>
          </div>
          <span className="text-xs text-white/60 font-medium">{challenge.trend}</span>
        </div>

        <button
          onClick={() => setJoined(!joined)}
          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            joined
              ? 'bg-white/30 text-white'
              : 'bg-white text-gray-800 hover:bg-white/90'
          }`}
        >
          {joined ? <><Check size={16} /> Défi rejoint !</> : <><Zap size={16} /> Relever le défi</>}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : Post populaire
// ============================================================
function PopularPost({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const formatCount = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-all">
      <img
        src={post.image}
        alt={post.caption}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ aspectRatio: post.size === 'large' ? '1/1' : '4/3' }}
      />

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="text-xs font-bold bg-white/90 backdrop-blur-sm text-[#0047AB] px-2.5 py-1 rounded-full shadow">
          {post.category}
        </span>
      </div>

      {/* Actions */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            saved ? 'bg-[#FFA75F] text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
        <div className="flex items-center gap-2 mb-1.5">
          <img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full ring-1 ring-white/50" />
          <span className="text-white text-xs font-semibold">{post.author}</span>
        </div>
        <p className="text-white/90 text-xs line-clamp-2 mb-2">{post.caption}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className="flex items-center gap-1 text-white text-xs"
          >
            <Heart size={12} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-red-400' : ''} />
            {formatCount(post.likes + (liked ? 1 : 0))}
          </button>
          <span className="flex items-center gap-1 text-white/80 text-xs">
            <MessageCircle size={12} />
            {formatCount(post.comments)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : Carte Sport à découvrir
// ============================================================
function SportCard({ sport }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="relative h-32 overflow-hidden">
        <img src={sport.image} alt={sport.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full">
            {sport.tag}
          </span>
        </div>
        <div className={`absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${sport.color} flex items-center justify-center shadow-lg`}>
          {sport.icon}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1">{sport.name}</h3>
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{sport.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#0047AB] font-medium">{sport.practitioners}</span>
          <button className="text-xs font-semibold text-[#FFA75F] flex items-center gap-1 hover:gap-2 transition-all">
            Explorer <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : Carte Spot Sportif
// ============================================================
function SpotCard({ spot }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-0 cursor-pointer">
      <div className="w-28 shrink-0 overflow-hidden">
        <img
          src={spot.image}
          alt={spot.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{spot.name}</h3>
        <p className="text-xs text-[#0047AB] font-medium mb-1">{spot.type}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={10} className="text-[#FFA75F] shrink-0" />
          <span className="truncate">{spot.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-gray-800">{spot.rating}</span>
            <span className="text-gray-400">• {spot.checkins.toLocaleString()} check-ins</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {spot.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function DecouvrirPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tout');

  const filters = ['Tout', 'Athlètes', 'Défis', 'Spots', 'Sports'];

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

          {/* ─── HERO ─── */}
          <div className="bg-gradient-to-r from-[#0047AB] to-[#FFA75F] px-6 py-8 lg:py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Compass size={32} className="text-white/90" />
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Découvrir</h1>
              </div>
              <p className="text-white/80 text-sm lg:text-base mb-6">
                Explore la communauté SANSLimites — athlètes inspirants, défis tendance, sports à tester et spots mythiques
              </p>

              {/* Barre de recherche */}
              <div className="relative max-w-xl mx-auto">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Recherche un athlète, un sport, un lieu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>

              {/* Filtres rapides */}
              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      activeFilter === f
                        ? 'bg-white text-[#0047AB] shadow'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 space-y-12">

            {/* ─── STATS GLOBALES ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Users size={20} className="text-[#0047AB]" />, value: '48 200', label: 'Athlètes actifs', bg: 'bg-[#0047AB]/8' },
                { icon: <Zap size={20} className="text-[#FFA75F]" />, value: '1 340', label: 'Défis en cours', bg: 'bg-[#FFA75F]/10' },
                { icon: <MapPin size={20} className="text-emerald-500" />, value: '890', label: 'Spots référencés', bg: 'bg-emerald-50' },
                { icon: <Flame size={20} className="text-red-400" />, value: '12 800', label: 'Posts cette semaine', bg: 'bg-red-50' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} rounded-2xl p-4 flex items-center gap-3`}>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg leading-tight">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── ATHLÈTES À SUIVRE ─── */}
            {(activeFilter === 'Tout' || activeFilter === 'Athlètes') && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#0047AB] flex items-center gap-2">
                      <Star size={22} className="text-[#FFA75F] fill-[#FFA75F]" />
                      Athlètes à suivre
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Sélection basée sur tes centres d'intérêt</p>
                  </div>
                  <button className="text-sm font-semibold text-[#0047AB] hover:text-[#FFA75F] flex items-center gap-1 transition-colors">
                    Voir tous <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {suggestedAthletes.map((athlete) => (
                    <AthleteCard key={athlete.id} athlete={athlete} />
                  ))}
                </div>
              </section>
            )}

            {/* ─── DÉFIS EN TENDANCE ─── */}
            {(activeFilter === 'Tout' || activeFilter === 'Défis') && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#0047AB] flex items-center gap-2">
                      <TrendingUp size={22} className="text-[#FFA75F]" />
                      Défis en tendance
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Les challenges qui font bouger la communauté</p>
                  </div>
                  <button className="text-sm font-semibold text-[#0047AB] hover:text-[#FFA75F] flex items-center gap-1 transition-colors">
                    Tous les défis <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {trendingChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </section>
            )}

            {/* ─── POSTS POPULAIRES ─── */}
            {(activeFilter === 'Tout') && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#0047AB] flex items-center gap-2">
                      <Flame size={22} className="text-[#FFA75F]" />
                      Posts populaires
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Le contenu qui a enflammé la communauté cette semaine</p>
                  </div>
                  <button className="text-sm font-semibold text-[#0047AB] hover:text-[#FFA75F] flex items-center gap-1 transition-colors">
                    Voir l'actu <ChevronRight size={16} />
                  </button>
                </div>

                {/* Grille masonry-like */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {popularPosts.map((post) => (
                    <div key={post.id} className={post.size === 'large' ? 'row-span-2' : ''}>
                      <PopularPost post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ─── SPORTS À DÉCOUVRIR ─── */}
            {(activeFilter === 'Tout' || activeFilter === 'Sports') && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#0047AB] flex items-center gap-2">
                      <Activity size={22} className="text-[#FFA75F]" />
                      Sports à découvrir
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Nouvelles disciplines qui gagnent du terrain</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sportsToDiscover.map((sport) => (
                    <SportCard key={sport.id} sport={sport} />
                  ))}
                </div>
              </section>
            )}

            {/* ─── SPOTS SPORTIFS ─── */}
            {(activeFilter === 'Tout' || activeFilter === 'Spots') && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#0047AB] flex items-center gap-2">
                      <MapPin size={22} className="text-[#FFA75F]" />
                      Spots sportifs populaires
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Les lieux plébiscités par la communauté</p>
                  </div>
                  <button className="text-sm font-semibold text-[#0047AB] hover:text-[#FFA75F] flex items-center gap-1 transition-colors">
                    Voir la carte <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sportSpots.map((spot) => (
                    <SpotCard key={spot.id} spot={spot} />
                  ))}
                </div>
              </section>
            )}

            {/* ─── BANNIÈRE CTA ─── */}
            <section>
              <div className="rounded-3xl bg-gradient-to-r from-[#0047AB] to-[#FFA75F] p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-20 translate-x-20" />
                <div className="absolute bottom-0 left-40 w-40 h-40 rounded-full bg-white/5 translate-y-16" />
                <div className="relative text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Tu as un sport ou un spot à partager ?</h3>
                  <p className="text-white/80 text-sm">Contribue à la carte communautaire et aide d'autres sportifs à se dépasser.</p>
                </div>
                <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
                  <button className="bg-white text-[#0047AB] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-all text-sm shadow-lg">
                    Ajouter un spot
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all text-sm border border-white/30">
                    Proposer un sport
                  </button>
                </div>
              </div>
            </section>

          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
