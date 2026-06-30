'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import { Heart, MessageCircle, UserPlus, Trophy, Star, Zap, Bell, Check, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { mapNotifications } from '../lib/mappers';
import { isAuthenticated } from '../lib/auth';

const initialNotifications = [
  {
    id: 1,
    type: 'like',
    read: false,
    timeAgo: 'Il y a 5 min',
    author: 'Marie Dupont',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    content: 'a aimé votre publication',
    detail: '« Nouveau record personnel au marathon ! 3h45 💪 »',
  },
  {
    id: 2,
    type: 'comment',
    read: false,
    timeAgo: 'Il y a 18 min',
    author: 'Thomas Martin',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    content: 'a commenté votre publication',
    detail: '« Bravo ! Tu as fait quoi comme préparation ? »',
  },
  {
    id: 3,
    type: 'follow',
    read: false,
    timeAgo: 'Il y a 1h',
    author: 'Sophie Bernard',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    content: 'a commencé à vous suivre',
    detail: null,
  },
  {
    id: 4,
    type: 'challenge',
    read: false,
    timeAgo: 'Il y a 2h',
    author: 'Défi du jour',
    authorImage: null,
    content: 'Nouveau défi disponible : Course de 5km 🏃',
    detail: '234 athlètes l\'ont déjà relevé !',
  },
  {
    id: 5,
    type: 'like',
    read: true,
    timeAgo: 'Il y a 3h',
    author: 'Lucas Petit',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    content: 'a aimé votre commentaire',
    detail: '« Félicitations ! Prochain objectif sous les 3h30 ? »',
  },
  {
    id: 6,
    type: 'badge',
    read: true,
    timeAgo: 'Il y a 5h',
    author: 'SANSLimites',
    authorImage: null,
    content: 'Vous avez débloqué un nouveau badge 🏅',
    detail: 'Badge « Régularité » — 7 jours d\'entraînement consécutifs',
  },
  {
    id: 7,
    type: 'comment',
    read: true,
    timeAgo: 'Il y a 6h',
    author: 'Julie Moreau',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie',
    content: 'a répondu à votre commentaire',
    detail: '« J\'ai toujours voulu essayer l\'escalade 🧗‍♀️ »',
  },
  {
    id: 8,
    type: 'follow',
    read: true,
    timeAgo: 'Il y a 8h',
    author: 'Alex Dubois',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: 'a commencé à vous suivre',
    detail: null,
  },
  {
    id: 9,
    type: 'mention',
    read: true,
    timeAgo: 'Hier',
    author: 'Camille Rousseau',
    authorImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camille',
    content: 'vous a mentionné dans une publication',
    detail: '« Merci @vous pour les conseils en course à pied ! »',
  },
  {
    id: 10,
    type: 'challenge',
    read: true,
    timeAgo: 'Hier',
    author: 'Défi de la semaine',
    authorImage: null,
    content: 'Défi terminé avec succès 🎉',
    detail: 'Vous avez complété le défi « 100 km à vélo » !',
  },
];

const typeConfig = {
  like: {
    icon: Heart,
    bg: 'bg-red-100',
    color: 'text-red-500',
    label: 'Like',
  },
  comment: {
    icon: MessageCircle,
    bg: 'bg-blue-100',
    color: 'text-[#0047AB]',
    label: 'Commentaire',
  },
  follow: {
    icon: UserPlus,
    bg: 'bg-green-100',
    color: 'text-green-600',
    label: 'Abonnement',
  },
  challenge: {
    icon: Zap,
    bg: 'bg-orange-100',
    color: 'text-[#FFA75F]',
    label: 'Défi',
  },
  badge: {
    icon: Trophy,
    bg: 'bg-yellow-100',
    color: 'text-yellow-500',
    label: 'Badge',
  },
  mention: {
    icon: Star,
    bg: 'bg-purple-100',
    color: 'text-purple-500',
    label: 'Mention',
  },
};

function NotificationItem({ notif, onRead, onDelete }) {
  // Repli sur « badge » si un type inattendu remonte du backend (évite un crash).
  const config = typeConfig[notif.type] || typeConfig.badge;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-4 px-5 py-4 border-b border-gray-100 transition-all group
        ${!notif.read ? 'bg-blue-50/60' : 'bg-white hover:bg-gray-50'}`}
    >
      {/* Avatar / icône type */}
      <div className="relative shrink-0">
        {notif.authorImage ? (
          <img
            src={notif.authorImage}
            alt={notif.author}
            className="w-12 h-12 rounded-full border-2 border-white shadow"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0047AB] to-[#FFA75F] flex items-center justify-center shadow">
            <Bell size={22} className="text-white" />
          </div>
        )}
        <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${config.bg} shadow`}>
          <Icon size={13} className={config.color} />
        </span>
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 leading-snug">
          <span className="font-bold text-[#0047AB]">{notif.author}</span>{' '}
          {notif.content}
        </p>
        {notif.detail && (
          <p className="text-xs text-gray-500 mt-1 italic truncate">{notif.detail}</p>
        )}
        <p className="text-xs text-gray-400 mt-1.5">{notif.timeAgo}</p>
      </div>

      {/* Indicateur non lu + actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!notif.read && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#0047AB] shrink-0" />
        )}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notif.read && (
            <button
              onClick={() => onRead(notif.id)}
              title="Marquer comme lu"
              className="p-1.5 rounded-full hover:bg-blue-100 text-[#0047AB] transition-all"
            >
              <Check size={15} />
            </button>
          )}
          <button
            onClick={() => onDelete(notif.id)}
            title="Supprimer"
            className="p-1.5 rounded-full hover:bg-red-100 text-red-400 transition-all"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [demoMode, setDemoMode] = useState(true);

  // Charge les vraies notifications si l'utilisateur est connecté.
  // En cas d'échec, on conserve les notifications de démonstration.
  useEffect(() => {
    if (!isAuthenticated()) return; // pas connecté → démo
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getNotifications();
        if (cancelled) return;
        setNotifications(mapNotifications(data));
        setDemoMode(false);
      } catch {
        if (!cancelled) setDemoMode(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (!demoMode && isAuthenticated()) {
      api.markAllNotificationsRead().catch(() => {});
    }
  };

  // Le backend n'expose pas (encore) de route « marquer une seule notif comme lue ».
  // On met donc à jour uniquement l'état local pour cette action unitaire.
  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const deleteNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!demoMode && isAuthenticated()) {
      api.deleteNotification(id).catch(() => {});
    }
  };

  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

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

        <main className="flex-1 overflow-y-auto px-4 lg:px-0 pb-8">
          <div className="max-w-2xl mx-auto pt-6">

            {/* En-tête de la page */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-bold text-[#0047AB] flex items-center gap-2">
                  <Bell size={26} className="text-[#FFA75F]" />
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-sm font-semibold text-[#0047AB] hover:text-[#FFA75F] flex items-center gap-1.5 transition-colors"
                >
                  <Check size={16} />
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                  ${filter === 'all'
                    ? 'bg-[#0047AB] text-white shadow'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0047AB]'}`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5
                  ${filter === 'unread'
                    ? 'bg-[#0047AB] text-white shadow'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-[#0047AB]'}`}
              >
                Non lues
                {unreadCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                    ${filter === 'unread' ? 'bg-white text-[#0047AB]' : 'bg-[#0047AB] text-white'}`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Liste des notifications */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Bell size={48} className="mb-3 opacity-30" />
                  <p className="font-semibold">Aucune notification</p>
                  <p className="text-sm">Vous êtes à jour !</p>
                </div>
              ) : (
                filtered.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notif={notif}
                    onRead={markRead}
                    onDelete={deleteNotif}
                  />
                ))
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
