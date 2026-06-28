'use client';

import { useState, useMemo } from 'react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import Footer from '../components/Footer/Footer';
import {
  TrendingUp, Clock, Eye, Heart, Bookmark, Share2,
  ChevronRight, Search, Filter, ArrowLeft, MessageCircle,
  Flame, Star, Trophy, Zap, Users, Globe, ChevronUp
} from 'lucide-react';

// ─────────────────────────────────────────
// DONNÉES
// ─────────────────────────────────────────

const categories = [
  { id: 'tous', label: 'Tout', icon: Globe },
  { id: 'performances', label: 'Performances', icon: Trophy },
  { id: 'entrainement', label: 'Entraînement', icon: Zap },
  { id: 'nutrition', label: 'Nutrition', icon: Flame },
  { id: 'communaute', label: 'Communauté', icon: Users },
  { id: 'inspirant', label: 'Inspirant', icon: Star },
];

const articles = [
  {
    id: 1,
    title: 'Marie Dupont pulvérise son record au marathon de Paris : 3h28 !',
    excerpt: 'Après 6 mois d\'un entraînement acharné documenté sur SANSLimites, Marie Dupont réalise l\'exploit de sa carrière lors du marathon de Paris. Une préparation exemplaire qui inspire toute la communauté.',
    content: `Marie Dupont, membre active de SANSLimites depuis 2 ans, a réalisé dimanche dernier l'un des exploits les plus marquants de notre communauté. Son chrono de 3h28 au marathon de Paris représente une amélioration de 17 minutes sur son précédent record personnel.

"Je dois tout à la communauté SANSLimites. Les défis quotidiens m'ont permis de rester motivée même les jours de doute", confie-t-elle dans sa publication d'après-course.

Sa préparation, entièrement documentée sur la plateforme, a suscité plus de 400 commentaires et 1 200 likes de la communauté. Elle prouve une fois de plus que le dépassement de soi n'a pas de limites.`,
    category: 'performances',
    categoryLabel: 'Performances',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=900&h=500&fit=crop',
    author: 'Équipe SANSLimites',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Editorial',
    date: '11 avril 2026',
    readTime: '4 min',
    views: 2841,
    likes: 312,
    comments: 47,
    featured: true,
    trending: true,
  },
  {
    id: 2,
    title: '5 exercices pour booster votre VO2max cet été',
    excerpt: 'Notre coach partenaire vous dévoile sa méthode éprouvée pour augmenter votre capacité aérobie en 8 semaines. Un programme adapté à tous les niveaux.',
    content: 'Article complet sur les méthodes d\'entraînement VO2max...',
    category: 'entrainement',
    categoryLabel: 'Entraînement',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
    author: 'Coach Alex Moreau',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    date: '10 avril 2026',
    readTime: '6 min',
    views: 1534,
    likes: 198,
    comments: 23,
    featured: false,
    trending: true,
  },
  {
    id: 3,
    title: 'Le groupe "Runners de Lyon" dépasse les 500 membres !',
    excerpt: 'Une belle milestone pour ce groupe fondé il y a seulement 4 mois. Retour sur l\'aventure collective qui a transformé une poignée de passionnés en véritable communauté.',
    content: 'Contenu complet sur la communauté de Lyon...',
    category: 'communaute',
    categoryLabel: 'Communauté',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
    author: 'Julie Moreau',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie',
    date: '9 avril 2026',
    readTime: '3 min',
    views: 987,
    likes: 145,
    comments: 31,
    featured: false,
    trending: false,
  },
  {
    id: 4,
    title: 'Nutrition sportive : les 8 aliments indispensables pour la récupération',
    excerpt: 'Quand on parle de performance, on pense entraînement. Mais la récupération, c\'est 50% du travail. Voici les aliments que tout athlète devrait intégrer dans son alimentation.',
    content: 'Article complet sur la nutrition sportive...',
    category: 'nutrition',
    categoryLabel: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop',
    author: 'Dr. Sophie Bernard',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    date: '8 avril 2026',
    readTime: '5 min',
    views: 2103,
    likes: 267,
    comments: 19,
    featured: false,
    trending: true,
  },
  {
    id: 5,
    title: '"Sans mes jambes, j\'ai trouvé mes ailes" : le parcours incroyable de Thomas',
    excerpt: 'Thomas Martin, amputé à 28 ans après un accident, a couru son premier semi-marathon en fauteuil il y a deux semaines. Son témoignage nous rappelle que les limites sont avant tout dans notre tête.',
    content: 'Témoignage complet de Thomas Martin...',
    category: 'inspirant',
    categoryLabel: 'Inspirant',
    image: 'https://images.unsplash.com/photo-1551958219-acbc595f9b47?w=800&h=500&fit=crop',
    author: 'Rédaction SANSLimites',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Redaction',
    date: '7 avril 2026',
    readTime: '7 min',
    views: 4512,
    likes: 621,
    comments: 89,
    featured: false,
    trending: true,
  },
  {
    id: 6,
    title: 'Défi du mois d\'avril : 30 jours de gainage, les résultats de la communauté',
    excerpt: 'Plus de 2 000 membres ont relevé le défi gainage du mois de mars. Les chiffres sont impressionnants et les transformations, bluffantes. On fait le bilan.',
    content: 'Bilan complet du défi gainage...',
    category: 'communaute',
    categoryLabel: 'Communauté',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop',
    author: 'Équipe SANSLimites',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Editorial',
    date: '6 avril 2026',
    readTime: '4 min',
    views: 1789,
    likes: 334,
    comments: 56,
    featured: false,
    trending: false,
  },
  {
    id: 7,
    title: 'Comment éviter les blessures au genou chez les cyclistes ?',
    excerpt: 'La douleur au genou est la bête noire des cyclistes. Notre kiné partenaire décrypte les causes les plus fréquentes et vous donne ses conseils pour prévenir et soigner.',
    content: 'Guide complet sur la prévention des blessures...',
    category: 'entrainement',
    categoryLabel: 'Entraînement',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=500&fit=crop',
    author: 'Kiné Pierre Favre',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre',
    date: '5 avril 2026',
    readTime: '5 min',
    views: 1245,
    likes: 156,
    comments: 14,
    featured: false,
    trending: false,
  },
  {
    id: 8,
    title: 'Camille bat le record de la communauté au squat : 120kg à 58kg de poids de corps !',
    excerpt: 'Un ratio force/poids exceptionnel pour Camille Rousseau, 24 ans, qui entre dans le top 10 de notre classement toutes catégories. Une progression de 3 ans de travail acharné.',
    content: 'Article complet sur la performance de Camille...',
    category: 'performances',
    categoryLabel: 'Performances',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=500&fit=crop',
    author: 'Équipe SANSLimites',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Editorial',
    date: '4 avril 2026',
    readTime: '3 min',
    views: 3201,
    likes: 489,
    comments: 62,
    featured: false,
    trending: true,
  },
  {
    id: 9,
    title: 'Smoothie protéiné post-entraînement : 5 recettes testées par la communauté',
    excerpt: 'La communauté s\'est mobilisée pour partager ses meilleures recettes de smoothie de récupération. Des options gourmandes, naturelles et surtout efficaces.',
    content: 'Recettes complètes de smoothies...',
    category: 'nutrition',
    categoryLabel: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=500&fit=crop',
    author: 'Emma Blanc',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    date: '3 avril 2026',
    readTime: '3 min',
    views: 876,
    likes: 134,
    comments: 28,
    featured: false,
    trending: false,
  },
  {
    id: 10,
    title: 'À 67 ans, Paul termine son premier Iron Man : "Je voulais prouver que l\'âge n\'est qu\'un chiffre"',
    excerpt: 'Paul Laurent, retraité et membre de SANSLimites depuis 18 mois, a bouclé son premier triathlon longue distance dimanche dernier. Un exploit qui redéfinit ce qu\'on appelle "les limites".',
    content: 'Témoignage de Paul Laurent...',
    category: 'inspirant',
    categoryLabel: 'Inspirant',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=500&fit=crop',
    author: 'Rédaction SANSLimites',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Redaction',
    date: '2 avril 2026',
    readTime: '6 min',
    views: 5643,
    likes: 812,
    comments: 104,
    featured: false,
    trending: true,
  },
];

const trending = articles.filter(a => a.trending).slice(0, 4);

// ─────────────────────────────────────────
// BADGE CATÉGORIE
// ─────────────────────────────────────────
const categoryStyles = {
  performances: 'bg-blue-100 text-blue-700',
  entrainement: 'bg-orange-100 text-orange-700',
  nutrition: 'bg-green-100 text-green-700',
  communaute: 'bg-purple-100 text-purple-700',
  inspirant: 'bg-[#FFA75F]/20 text-[#FFA75F]',
};

function CategoryBadge({ cat, label }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryStyles[cat] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────
// ARTICLE À LA UNE
// ─────────────────────────────────────────
function FeaturedArticle({ article, onClick }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-xl border-2 border-[#0047AB]/10 hover:border-[#FFA75F]/50 transition-all hover:shadow-2xl"
      style={{ minHeight: 400 }}
    >
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
        style={{ minHeight: 400 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/95 via-[#0047AB]/50 to-transparent" />

      {/* Badge trending */}
      <div className="absolute top-5 left-5 flex gap-2">
        <span className="bg-[#FFA75F] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Flame size={12} /> À la une
        </span>
        <CategoryBadge cat={article.category} label={article.categoryLabel} />
      </div>

      {/* Contenu */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-tight drop-shadow">
          {article.title}
        </h2>
        <p className="text-white/80 text-sm mb-5 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={article.authorAvatar} alt={article.author} className="w-9 h-9 rounded-full ring-2 ring-white/50" />
            <div>
              <p className="text-white font-semibold text-sm">{article.author}</p>
              <p className="text-white/60 text-xs flex items-center gap-2">
                {article.date} · <Clock size={10} /> {article.readTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={e => { e.stopPropagation(); setLiked(!liked); }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${liked ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
              {article.likes + (liked ? 1 : 0)}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setSaved(!saved); }}
              className={`p-2 rounded-full transition-colors ${saved ? 'bg-[#FFA75F]/30 text-[#FFA75F]' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// CARTE ARTICLE
// ─────────────────────────────────────────
function ArticleCard({ article, onClick }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-gray-100 hover:border-[#0047AB]/30 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <CategoryBadge cat={article.category} label={article.categoryLabel} />
          {article.trending && (
            <span className="bg-[#FFA75F] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={10} /> Tendance
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-xs text-gray-600 font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
          <Clock size={10} /> {article.readTime}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#0047AB] text-base leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img src={article.authorAvatar} alt={article.author} className="w-7 h-7 rounded-full" />
            <div>
              <p className="text-xs font-semibold text-gray-700">{article.author}</p>
              <p className="text-xs text-gray-400">{article.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); setLiked(!liked); }}
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
              {article.likes + (liked ? 1 : 0)}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setSaved(!saved); }}
              className={`transition-colors ${saved ? 'text-[#FFA75F]' : 'text-gray-400 hover:text-[#FFA75F]'}`}
            >
              <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// VUE DÉTAIL D'UN ARTICLE
// ─────────────────────────────────────────
function ArticleDetail({ article, onBack }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Lucas P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', text: 'Incroyable ! Quelle inspiration pour toute la communauté 🔥', date: 'Il y a 2h' },
    { id: 2, author: 'Emma B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', text: 'J\'ai suivi tout son parcours sur SANSLimites, tellement mérité !', date: 'Il y a 4h' },
  ]);

  const handleComment = () => {
    if (newComment.trim()) {
      setComments(prev => [...prev, {
        id: Date.now(),
        author: 'Vous',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
        text: newComment,
        date: 'À l\'instant',
      }]);
      setNewComment('');
    }
  };

  const related = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      {/* Retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#0047AB] font-semibold mb-6 hover:text-[#FFA75F] transition-colors group/back"
      >
        <ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
        Retour aux actualités
      </button>

      {/* Cover */}
      <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden mb-6">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-5 left-5 flex gap-2">
          <CategoryBadge cat={article.category} label={article.categoryLabel} />
          {article.trending && (
            <span className="bg-[#FFA75F] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <TrendingUp size={10} /> Tendance
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* En-tête */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-[#0047AB] leading-tight mb-4">{article.title}</h1>

            <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img src={article.authorAvatar} alt={article.author} className="w-11 h-11 rounded-full ring-2 ring-[#0047AB]/20" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{article.author}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    {article.date} · <Clock size={10} /> {article.readTime} de lecture
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Eye size={13} /> {article.views.toLocaleString()} vues
              </div>
            </div>

            <p className="text-sm text-gray-600 italic leading-relaxed mb-6 border-l-4 border-[#FFA75F] pl-4">
              {article.excerpt}
            </p>

            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${liked ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-400'}`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                {article.likes + (liked ? 1 : 0)} J'aime
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${saved ? 'border-[#FFA75F] bg-[#FFA75F]/10 text-[#FFA75F]' : 'border-gray-200 text-gray-600 hover:border-[#FFA75F] hover:text-[#FFA75F]'}`}
              >
                <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Sauvegardé' : 'Sauvegarder'}
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:border-[#0047AB] hover:text-[#0047AB] transition-all">
              <Share2 size={16} /> Partager
            </button>
          </div>

          {/* Commentaires */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-5 flex items-center gap-2">
              <MessageCircle size={18} /> Commentaires ({comments.length})
            </h2>

            <div className="space-y-4 mb-5">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <img src={c.avatar} alt={c.author} className="w-9 h-9 rounded-full shrink-0 ring-1 ring-gray-200" />
                  <div className="flex-1 bg-[#f8f9fa] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-gray-800">{c.author}</p>
                      <p className="text-xs text-gray-400">{c.date}</p>
                    </div>
                    <p className="text-sm text-gray-700">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                alt="Vous"
                className="w-9 h-9 rounded-full shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleComment()}
                  className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0047AB] transition-colors"
                />
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-semibold hover:bg-[#FFA75F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>

          {/* Articles liés */}
          {related.length > 0 && (
            <div>
              <h2 className="font-bold text-[#0047AB] text-lg mb-4">Articles similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(a => (
                  <ArticleCard key={a.id} article={a} onClick={() => {}} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Tendances */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-4">
            <h2 className="font-bold text-[#0047AB] text-base mb-4 flex items-center gap-2">
              <TrendingUp size={16} /> Tendances du moment
            </h2>
            <div className="space-y-4">
              {trending.filter(a => a.id !== article.id).slice(0, 3).map((a, i) => (
                <div key={a.id} className="flex gap-3 group cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#FFA75F] flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-[#0047AB] transition-colors">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Eye size={9} /> {a.views.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────
export default function ActualitesPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const featuredArticle = articles.find(a => a.featured);
  const otherArticles = articles.filter(a => !a.featured);

  const filtered = useMemo(() => {
    return otherArticles.filter(a => {
      const matchCat = activeCategory === 'tous' || a.category === activeCategory;
      const matchSearch =
        search.trim() === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.author.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const handleScroll = (e) => {
    setShowScrollTop(e.target.scrollTop > 400);
  };

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

        <main className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          {selectedArticle ? (
            <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
          ) : (
            <>
              {/* Hero */}
              <div className="bg-gradient-to-r from-[#0047AB] to-[#FFA75F] px-6 py-8 lg:py-10">
                <div className="max-w-5xl mx-auto">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    <TrendingUp size={30} />
                    Actualités sportives
                  </h1>
                  <p className="text-white/80 text-sm lg:text-base">
                    Performances, conseils, inspirations — tout ce qui fait vibrer la communauté SANSLimites
                  </p>
                </div>
              </div>

              <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6">

                {/* Barre de recherche */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                  <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un article, un auteur..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0047AB] transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={14} className="text-gray-400 shrink-0" />
                    {categories.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveCategory(id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                          ${activeCategory === id
                            ? 'bg-[#0047AB] text-white shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-[#0047AB]/10 hover:text-[#0047AB]'}`}
                      >
                        <Icon size={11} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Article à la une — visible uniquement sur "tous" sans recherche */}
                {activeCategory === 'tous' && !search && featuredArticle && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Flame size={18} className="text-[#FFA75F]" />
                      <h2 className="font-bold text-[#0047AB] text-lg">À la une</h2>
                    </div>
                    <FeaturedArticle article={featuredArticle} onClick={() => setSelectedArticle(featuredArticle)} />
                  </div>
                )}

                {/* Grille d'articles + sidebar tendances */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Articles */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-500">
                        <span className="font-bold text-[#0047AB]">{filtered.length}</span> article{filtered.length > 1 ? 's' : ''}
                      </p>
                    </div>

                    {filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <TrendingUp size={52} className="mb-3 opacity-30" />
                        <p className="font-semibold text-base">Aucun article trouvé</p>
                        <p className="text-sm">Essayez de modifier votre recherche</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {filtered.map(article => (
                          <ArticleCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sidebar tendances */}
                  <div className="space-y-5">
                    {/* Top tendances */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <h2 className="font-bold text-[#0047AB] text-base mb-4 flex items-center gap-2">
                        <TrendingUp size={16} /> Tendances du moment
                      </h2>
                      <div className="space-y-4">
                        {trending.map((a, i) => (
                          <div
                            key={a.id}
                            onClick={() => setSelectedArticle(a)}
                            className="flex gap-3 group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#FFA75F] flex items-center justify-center shrink-0">
                              <span className="text-white font-bold text-xs">{i + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-[#0047AB] transition-colors">{a.title}</p>
                              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                <Eye size={9} /> {a.views.toLocaleString()}
                                <span>·</span>
                                <Heart size={9} /> {a.likes}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats communauté */}
                    <div className="bg-gradient-to-br from-[#0047AB] to-[#002d6e] rounded-2xl p-5 text-white">
                      <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                        <Users size={16} /> La communauté en chiffres
                      </h2>
                      <div className="space-y-3">
                        {[
                          { label: 'Articles publiés', value: '1 247', icon: TrendingUp },
                          { label: 'Membres actifs', value: '18 430', icon: Users },
                          { label: 'Likes cette semaine', value: '42 890', icon: Heart },
                        ].map(({ label, value, icon: Icon }) => (
                          <div key={label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                              <Icon size={13} /> {label}
                            </div>
                            <span className="font-bold text-[#FFA75F] text-sm">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Newsletter */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-[#FFA75F]/30">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#FFA75F]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Zap size={22} className="text-[#FFA75F]" />
                        </div>
                        <h3 className="font-bold text-[#0047AB] text-sm mb-1">Ne ratez rien !</h3>
                        <p className="text-xs text-gray-500 mb-4">Recevez les meilleures actus de la communauté chaque semaine.</p>
                        <button className="w-full py-2.5 bg-gradient-to-r from-[#0047AB] to-[#FFA75F] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                          S'abonner
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
            </>
          )}

          {/* Bouton scroll to top */}
          {showScrollTop && !selectedArticle && (
            <button
              onClick={() => document.querySelector('main').scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 w-10 h-10 bg-[#0047AB] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FFA75F] transition-colors z-40"
            >
              <ChevronUp size={18} />
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
