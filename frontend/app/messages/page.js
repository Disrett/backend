'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Filter,
  Heart,
  Image as ImageIcon,
  Info,
  MessageCircleMore,
  Mic,
  Pencil,
  Phone,
  Search,
  SendHorizonal,
  Shield,
  Smile,
  Star,
  Video,
  X,
} from 'lucide-react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';

const EMOJIS = ['😀', '😂', '😍', '🥹', '🔥', '👏', '💙', '🤝', '🙌', '😎', '😮', '❤️'];

const initialThreads = [
  {
    id: 1,
    name: 'Brandon',
    username: '@brandon.fit',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Brandon',
    online: true,
    verified: true,
    unread: 2,
    pinned: true,
    favorite: true,
    archived: false,
    restricted: false,
    lastMessage: 'La couleur de cheveux, ça banger 🔥',
    lastTime: '1 min',
    tags: ['Proche', 'Créateur'],
    notes: 'Très actif ce soir, échange souvent des vidéos et des idées de contenus.',
    messages: [
      { id: 101, sender: 'them', type: 'text', text: 'La dame qui fait un malaise au Inter… 😭', time: '20:41', status: 'seen', liked: false },
      { id: 102, sender: 'me', type: 'text', text: 'Ah oui ptn ça aussi c’est une dinguerie quand même mdr', time: '20:42', status: 'seen', reaction: '🤯' },
      { id: 103, sender: 'them', type: 'image', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&h=900&fit=crop', text: 'Regarde cette photo', time: '20:45', status: 'seen', liked: false },
      { id: 104, sender: 'me', type: 'text', text: 'J’aime bien j’aime bien', time: '20:46', status: 'seen', reaction: '💗' },
      { id: 105, sender: 'me', type: 'text', text: 'La couleur de cheveux banger', time: '20:46', status: 'seen', reaction: '💗' },
    ],
  },
  {
    id: 2,
    name: 'Julie Moreau',
    username: '@julie.run',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie',
    online: false,
    verified: false,
    unread: 0,
    pinned: true,
    favorite: false,
    archived: false,
    restricted: false,
    lastMessage: 'Je t’envoie le parcours pour dimanche !',
    lastTime: '18 min',
    tags: ['Running'],
    notes: 'Prépare un semi-marathon, aime recevoir des parcours GPX et des conseils récup.',
    messages: [
      { id: 201, sender: 'them', type: 'text', text: 'Tu cours demain matin ?', time: '18:02', status: 'seen', liked: false },
      { id: 202, sender: 'me', type: 'text', text: 'Oui, vers 8h normalement', time: '18:03', status: 'seen' },
      { id: 203, sender: 'them', type: 'text', text: 'Parfait, je t’envoie le parcours pour dimanche !', time: '18:06', status: 'delivered', liked: false },
    ],
  },
  {
    id: 3,
    name: 'Team Sans Limites',
    username: '7 participants',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TeamSansLimites',
    online: false,
    verified: false,
    unread: 4,
    pinned: false,
    favorite: false,
    archived: false,
    restricted: false,
    lastMessage: 'Alex: On garde le visuel orange/bleu pour la campagne',
    lastTime: '42 min',
    tags: ['Groupe'],
    notes: 'Groupe de travail pour la commu, les défis et les visuels marketing.',
    messages: [
      { id: 301, sender: 'them', author: 'Alex', type: 'text', text: 'On garde le visuel orange/bleu pour la campagne', time: '19:31', status: 'seen', liked: false },
      { id: 302, sender: 'me', type: 'text', text: 'Oui, ça colle mieux à la charte actuelle', time: '19:33', status: 'seen' },
      { id: 303, sender: 'them', author: 'Thomas', type: 'text', text: 'Je peux faire une variante avec plus de contraste', time: '19:38', status: 'delivered', liked: false },
    ],
  },
  {
    id: 4,
    name: 'Sophie Bernard',
    username: '@sophie.climb',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    online: true,
    verified: false,
    unread: 1,
    pinned: false,
    favorite: true,
    archived: false,
    restricted: false,
    lastMessage: 'Tu viens à la séance escalade ?',
    lastTime: '1 h',
    tags: ['Escalade'],
    notes: 'Envoie souvent des photos de spots outdoor et des créneaux de grimpe.',
    messages: [
      { id: 401, sender: 'them', type: 'text', text: 'Tu viens à la séance escalade ?', time: '17:18', status: 'delivered', liked: false },
    ],
  },
  {
    id: 5,
    name: 'Marie Dupont',
    username: '@marie.endurance',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    online: false,
    verified: true,
    unread: 0,
    pinned: false,
    favorite: false,
    archived: false,
    restricted: false,
    lastMessage: 'Merci encore pour ton retour sur le post 🙌',
    lastTime: 'Hier',
    tags: ['Course', 'Motivation'],
    notes: 'Très engagée sur les posts et les retours de la communauté.',
    messages: [
      { id: 501, sender: 'them', type: 'text', text: 'Merci encore pour ton retour sur le post 🙌', time: 'Hier · 21:04', status: 'seen', liked: false },
    ],
  },
];

function MessageStatus({ status }) {
  if (status === 'seen') return <CheckCheck size={14} className="text-[#0047AB]" />;
  if (status === 'delivered') return <CheckCheck size={14} className="text-white/70" />;
  return <Check size={14} className="text-white/70" />;
}

function PinMini({ active }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={active ? 'text-white/80' : 'text-slate-400'}>
      <path d="M15 4L20 9L15.5 10.5L13 18L11 18.5L11 13L4 6L15 4Z" fill="currentColor" />
    </svg>
  );
}

function SectionToggle({ title, count, open, onClick, tone = 'slate' }) {
  const activeTone = tone === 'orange' ? 'text-[#F28F45]' : 'text-[#0047AB]';
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left shadow-sm hover:border-[#0047AB]/20"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-sm font-semibold ${activeTone}`}>{title}</span>
        <span className="min-w-6 h-6 px-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold inline-flex items-center justify-center">{count}</span>
      </div>
      {open ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
    </button>
  );
}

function ThreadListItem({ thread, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-[24px] px-4 py-3.5 transition-all border ${
        active
          ? 'bg-gradient-to-r from-[#0047AB] to-[#0A57C6] text-white border-transparent shadow-[0_18px_40px_rgba(0,71,171,0.24)]'
          : 'bg-white/85 border-white/80 hover:bg-white hover:border-[#0047AB]/20 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img src={thread.avatar} alt={thread.name} className="w-14 h-14 rounded-full border-2 border-white shadow" />
          {thread.online && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`font-semibold truncate ${active ? 'text-white' : 'text-slate-900'}`}>{thread.name}</p>
            {thread.verified && <Star size={14} className="text-[#FFA75F] fill-[#FFA75F]" />}
            {thread.pinned && <PinMini active={active} />}
          </div>
          <p className={`text-sm truncate mt-1 ${active ? 'text-white/85' : 'text-slate-500'}`}>{thread.lastMessage}</p>
          <div className="flex items-center justify-between mt-2 gap-3">
            <span className={`text-xs ${active ? 'text-white/70' : 'text-slate-400'}`}>{thread.lastTime}</span>
            <div className="flex items-center gap-2 shrink-0">
              {thread.archived && <Archive size={13} className={active ? 'text-white/80' : 'text-slate-400'} />}
              {thread.restricted && <Shield size={13} className={active ? 'text-white/80' : 'text-slate-400'} />}
              {thread.unread > 0 ? (
                <span className={`min-w-6 h-6 px-1.5 rounded-full text-xs font-bold inline-flex items-center justify-center ${active ? 'bg-white text-[#0047AB]' : 'bg-[#0047AB] text-white'}`}>
                  {thread.unread}
                </span>
              ) : thread.favorite ? (
                <Heart size={14} className="text-[#FFA75F] fill-[#FFA75F]" />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function InfoDrawer({ thread, open, onClose, onArchiveToggle, onRestrictToggle, sharedMedia }) {
  return (
    <>
      <div
        className={`absolute inset-0 bg-[#051733]/30 backdrop-blur-[2px] transition-opacity duration-300 z-20 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-[360px] bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-[-16px_0_40px_rgba(0,29,77,0.14)] z-30 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Informations</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{thread.name}</h3>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 sl-scrollbar">
            <div className="text-center">
              <img src={thread.avatar} alt={thread.name} className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg" />
              <p className="mt-4 text-xl font-bold text-slate-900">{thread.username}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {thread.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#0047AB]/8 text-[#0047AB] text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">À propos</h4>
              <p className="text-sm text-slate-600 leading-7">{thread.notes}</p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Médias partagés</h4>
              {sharedMedia.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {sharedMedia.map((src, index) => (
                    <img key={`${src}-${index}`} src={src} alt="Média partagé" className="aspect-square object-cover rounded-[20px] shadow-sm" />
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 text-center">
                  Aucun média envoyé dans cette conversation.
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-2 text-sm text-slate-600">
              <button onClick={onArchiveToggle} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-slate-100 transition-colors text-left">
                <Archive size={17} />
                {thread.archived ? 'Retirer des conversations archivées' : 'Archiver la conversation'}
              </button>
              <button onClick={onRestrictToggle} className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-slate-100 transition-colors text-left">
                <Shield size={17} />
                {thread.restricted ? 'Retirer des comptes bloqués' : 'Restreindre ce compte'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function MessagesPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [search, setSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [mobileView, setMobileView] = useState('list');
  const [listFilter, setListFilter] = useState('all');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showArchived, setShowArchived] = useState(true);
  const [showRestricted, setShowRestricted] = useState(false);
  const [toast, setToast] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const activeThread = threads.find((thread) => thread.id === activeThreadId) || threads[0];

  const visibleThreads = useMemo(() => threads.filter((thread) => !thread.archived && !thread.restricted), [threads]);
  const archivedThreads = useMemo(() => threads.filter((thread) => thread.archived), [threads]);
  const restrictedThreads = useMemo(() => threads.filter((thread) => thread.restricted), [threads]);

  const matchesSearchAndFilter = (thread) => {
    const haystacks = [thread.name, thread.lastMessage, ...(thread.tags || [])].join(' ').toLowerCase();
    const matchesSearch = haystacks.includes(search.toLowerCase());
    const matchesFilter =
      listFilter === 'all' ||
      (listFilter === 'unread' && thread.unread > 0) ||
      (listFilter === 'favorites' && thread.favorite) ||
      (listFilter === 'groups' && thread.tags.includes('Groupe'));

    return matchesSearch && matchesFilter;
  };

  const filteredThreads = useMemo(() => visibleThreads.filter(matchesSearchAndFilter), [visibleThreads, search, listFilter]);
  const filteredArchivedThreads = useMemo(() => archivedThreads.filter(matchesSearchAndFilter), [archivedThreads, search, listFilter]);
  const filteredRestrictedThreads = useMemo(() => restrictedThreads.filter(matchesSearchAndFilter), [restrictedThreads, search, listFilter]);

  const sharedMedia = useMemo(
    () => (activeThread?.messages || []).filter((message) => message.type === 'image' && message.image).map((message) => message.image),
    [activeThread]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThreadId, threads]);

  useEffect(() => {
    setShowInfoPanel(false);
    setShowEmojiPicker(false);
  }, [activeThreadId]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [messageInput]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectThread = (threadId) => {
    setActiveThreadId(threadId);
    setThreads((prev) => prev.map((thread) => (thread.id === threadId ? { ...thread, unread: 0 } : thread)));
    setMobileView('chat');
  };

  const updateThread = (threadId, updater) => {
    setThreads((prev) => prev.map((thread) => (thread.id === threadId ? updater(thread) : thread)));
  };

  const sendMessage = () => {
    const text = messageInput.trim();
    if (!text || !activeThread) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      type: 'text',
      text,
      time: 'À l’instant',
      status: 'sent',
    };

    updateThread(activeThread.id, (thread) => ({
      ...thread,
      lastMessage: text,
      lastTime: 'À l’instant',
      messages: [...thread.messages, newMessage],
    }));
    setMessageInput('');

    window.setTimeout(() => {
      updateThread(activeThread.id, (thread) => ({
        ...thread,
        lastMessage: 'Bien reçu 🙌 On continue là-dessus !',
        lastTime: 'À l’instant',
        messages: [
          ...thread.messages,
          {
            id: Date.now() + 1,
            sender: 'them',
            type: 'text',
            text: 'Bien reçu 🙌 On continue là-dessus !',
            time: 'À l’instant',
            status: 'delivered',
            liked: false,
          },
        ],
      }));
    }, 1200);
  };

  const toggleLikeMessage = (messageId) => {
    if (!activeThread) return;
    updateThread(activeThread.id, (thread) => ({
      ...thread,
      messages: thread.messages.map((message) =>
        message.id === messageId ? { ...message, liked: !message.liked } : message
      ),
    }));
  };

  const appendEmoji = (emoji) => {
    setMessageInput((prev) => `${prev}${emoji}`);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handlePickImage = (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeThread) return;

    const objectUrl = URL.createObjectURL(file);
    const imageMessage = {
      id: Date.now(),
      sender: 'me',
      type: 'image',
      image: objectUrl,
      text: messageInput.trim() || '',
      time: 'À l’instant',
      status: 'sent',
    };

    updateThread(activeThread.id, (thread) => ({
      ...thread,
      lastMessage: file.name,
      lastTime: 'À l’instant',
      messages: [...thread.messages, imageMessage],
    }));

    setMessageInput('');
    event.target.value = '';
    setToast('Photo envoyée dans la conversation.');
  };

  const triggerArchive = () => {
    if (!activeThread) return;
    const nextArchivedState = !activeThread.archived;
    updateThread(activeThread.id, (thread) => ({ ...thread, archived: nextArchivedState, restricted: false }));
    setShowArchived(true);
    setToast(nextArchivedState ? 'Conversation archivée.' : 'Conversation retirée des archives.');
  };

  const triggerRestrict = () => {
    if (!activeThread) return;
    const nextRestrictedState = !activeThread.restricted;
    updateThread(activeThread.id, (thread) => ({ ...thread, restricted: nextRestrictedState, archived: false }));
    setShowRestricted(true);
    setToast(nextRestrictedState ? 'Compte ajouté aux comptes bloqués.' : 'Compte retiré des comptes bloqués.');
  };

  const fakeAction = (label) => setToast(label);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f7fb] overflow-hidden">
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      <div className="lg:ml-64 flex-1 flex flex-col w-full min-w-0" onClick={() => setShowMenu(false)}>
        <Header setShowMobileMenu={setShowMobileMenu} />

        <main className="flex-1 min-h-0 px-3 py-3 md:px-5 md:py-5">
          <div className="h-full min-h-0 rounded-[30px] border border-white/70 bg-white/50 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,71,171,0.12)] overflow-hidden">
            <div className="h-full min-h-0 grid lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
              <aside className={`${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col border-r border-slate-200/70 bg-gradient-to-b from-white via-[#f8fbff] to-[#edf4ff]`}>
                <div className="shrink-0 p-5 border-b border-slate-200/70 space-y-4 bg-white/80 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">Messages privés</h1>
                      <p className="text-sm text-slate-500 mt-1">Version desktop fixe, fluide et plus pratique à utiliser.</p>
                    </div>
                    <button onClick={() => fakeAction('Nouvelle conversation bientôt disponible.')} className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0047AB] to-[#FFA75F] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                      <Pencil size={18} />
                    </button>
                  </div>

                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher une conversation"
                      className="w-full h-12 rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/15"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sl-scrollbar">
                    {[
                      ['all', 'Tout'],
                      ['unread', 'Non lus'],
                      ['favorites', 'Favoris'],
                      ['groups', 'Groupes'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setListFilter(value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          listFilter === value
                            ? 'bg-[#0047AB] text-white shadow'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0047AB]/25'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    <button onClick={() => fakeAction('Filtres avancés à venir.')} className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <Filter size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 sl-scrollbar">
                  <div className="space-y-3">
                    {filteredThreads.length > 0 ? (
                      filteredThreads.map((thread) => (
                        <ThreadListItem
                          key={thread.id}
                          thread={thread}
                          active={thread.id === activeThreadId}
                          onClick={() => selectThread(thread.id)}
                        />
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 p-6 text-center">
                        <MessageCircleMore size={38} className="mx-auto text-[#0047AB]/50 mb-3" />
                        <p className="font-semibold text-slate-700">Aucune conversation trouvée</p>
                        <p className="text-sm text-slate-500 mt-1">Essaie un autre nom, un tag ou un filtre.</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <SectionToggle title="Conversations archivées" count={filteredArchivedThreads.length} open={showArchived} onClick={() => setShowArchived((prev) => !prev)} />
                    {showArchived && (
                      <div className="space-y-3">
                        {filteredArchivedThreads.length > 0 ? (
                          filteredArchivedThreads.map((thread) => (
                            <ThreadListItem key={thread.id} thread={thread} active={thread.id === activeThreadId} onClick={() => selectThread(thread.id)} />
                          ))
                        ) : (
                          <div className="rounded-[20px] bg-white/70 border border-slate-200 px-4 py-4 text-sm text-slate-500">Aucune conversation archivée.</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <SectionToggle title="Comptes bloqués" count={filteredRestrictedThreads.length} open={showRestricted} onClick={() => setShowRestricted((prev) => !prev)} tone="orange" />
                    {showRestricted && (
                      <div className="space-y-3">
                        {filteredRestrictedThreads.length > 0 ? (
                          filteredRestrictedThreads.map((thread) => (
                            <ThreadListItem key={thread.id} thread={thread} active={thread.id === activeThreadId} onClick={() => selectThread(thread.id)} />
                          ))
                        ) : (
                          <div className="rounded-[20px] bg-white/70 border border-slate-200 px-4 py-4 text-sm text-slate-500">Aucun compte bloqué.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </aside>

              <section className={`${mobileView === 'list' ? 'hidden lg:flex' : 'flex'} min-w-0 min-h-0 flex-col bg-[radial-gradient(circle_at_top,_rgba(255,167,95,0.12),_transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] relative overflow-hidden`}>
                {activeThread && (
                  <>
                    <div className="shrink-0 px-4 md:px-6 py-4 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => setMobileView('list')}
                          className="lg:hidden w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <div className="relative shrink-0">
                          <img src={activeThread.avatar} alt={activeThread.name} className="w-12 h-12 rounded-full border-2 border-white shadow" />
                          {activeThread.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-slate-900 truncate">{activeThread.name}</h2>
                            {activeThread.verified && <Star size={14} className="text-[#FFA75F] fill-[#FFA75F]" />}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{activeThread.online ? 'En ligne maintenant' : activeThread.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button onClick={() => fakeAction('Appel audio bientôt disponible.')} className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0047AB] hover:border-[#0047AB]/30 transition-all flex items-center justify-center shadow-sm">
                          <Phone size={18} />
                        </button>
                        <button onClick={() => fakeAction('Appel vidéo bientôt disponible.')} className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0047AB] hover:border-[#0047AB]/30 transition-all flex items-center justify-center shadow-sm">
                          <Video size={18} />
                        </button>
                        <button
                          onClick={() => setShowInfoPanel(true)}
                          className={`w-11 h-11 rounded-full border transition-all flex items-center justify-center shadow-sm ${
                            showInfoPanel
                              ? 'bg-[#0047AB] border-[#0047AB] text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:text-[#0047AB] hover:border-[#0047AB]/30'
                          }`}
                        >
                          <Info size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col relative">
                      <div className="flex-1 min-h-0 overflow-y-auto px-3 md:px-6 py-5 sl-scrollbar">
                        <div className="mx-auto w-full max-w-5xl space-y-3">
                          <div className="flex justify-center">
                            <span className="px-4 py-1.5 rounded-full bg-white/85 border border-slate-200 text-xs text-slate-500 shadow-sm">Aujourd’hui</span>
                          </div>

                          {activeThread.messages.map((message) => (
                            <div key={message.id} className={`group flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[90%] lg:max-w-[75%] xl:max-w-[70%] ${message.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                {message.author && message.sender === 'them' && (
                                  <span className="text-xs font-semibold text-slate-500 px-2">{message.author}</span>
                                )}

                                <div className="flex items-end gap-2">
                                  {message.sender === 'them' && (
                                    <button
                                      onClick={() => toggleLikeMessage(message.id)}
                                      className={`mb-1 w-8 h-8 rounded-full border shadow-sm flex items-center justify-center transition-all ${
                                        message.liked
                                          ? 'bg-[#FFA75F] border-[#FFA75F] text-white scale-100'
                                          : 'bg-white border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-[#FFA75F] hover:border-[#FFA75F]/40'
                                      }`}
                                    >
                                      <Heart size={14} className={message.liked ? 'fill-white' : ''} />
                                    </button>
                                  )}

                                  <div
                                    className={`rounded-[24px] overflow-hidden shadow-sm ${
                                      message.sender === 'me'
                                        ? 'bg-gradient-to-r from-[#0047AB] to-[#2168d3] text-white rounded-br-md'
                                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                                    }`}
                                  >
                                    {message.type === 'image' && <img src={message.image} alt="Message multimédia" className="w-full max-h-[460px] object-cover" />}
                                    {message.text && (
                                      <div className="px-4 py-3">
                                        <p className="text-[15px] leading-relaxed">{message.text}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {message.liked && message.sender === 'them' && (
                                  <div className="px-3 -mt-0.5">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#FFA75F]/20 px-2.5 py-1 text-xs font-semibold text-[#F28F45] shadow-sm">
                                      <Heart size={12} className="fill-[#F28F45]" />
                                      J’aime
                                    </span>
                                  </div>
                                )}

                                <div className={`px-1 flex items-center gap-2 text-xs ${message.sender === 'me' ? 'text-slate-400' : 'text-slate-500'}`}>
                                  <span>{message.time}</span>
                                  {message.sender === 'me' && <MessageStatus status={message.status} />}
                                  {message.reaction && (
                                    <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 shadow-sm text-sm">{message.reaction}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      <div className="shrink-0 border-t border-slate-200/70 bg-white/85 backdrop-blur-xl px-3 md:px-6 py-4">
                        <div className="mx-auto w-full max-w-5xl relative">
                          {showEmojiPicker && (
                            <div className="absolute bottom-[calc(100%+10px)] left-2 rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_20px_45px_rgba(15,23,42,0.14)] z-20 w-[280px]">
                              <div className="grid grid-cols-6 gap-2">
                                {EMOJIS.map((emoji) => (
                                  <button key={emoji} onClick={() => appendEmoji(emoji)} className="h-10 rounded-2xl hover:bg-slate-100 text-xl transition-colors">
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-end gap-2 md:gap-3 rounded-[30px] border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                            <button onClick={() => setShowEmojiPicker((prev) => !prev)} className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#0047AB] flex items-center justify-center shrink-0">
                              <Smile size={20} />
                            </button>
                            <textarea
                              ref={textareaRef}
                              rows={1}
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder="Écrire un message privé…"
                              className="flex-1 resize-none bg-transparent outline-none text-[15px] text-slate-800 placeholder:text-slate-400 py-2 max-h-40"
                            />
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={() => fakeAction('Message vocal bientôt disponible.')} className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#0047AB] flex items-center justify-center">
                                <Mic size={19} />
                              </button>
                              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePickImage} />
                              <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#0047AB] flex items-center justify-center">
                                <ImageIcon size={19} />
                              </button>
                              <button
                                onClick={sendMessage}
                                className="w-11 h-11 rounded-full bg-gradient-to-r from-[#0047AB] to-[#FFA75F] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                              >
                                <SendHorizonal size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <InfoDrawer
                      thread={activeThread}
                      open={showInfoPanel}
                      onClose={() => setShowInfoPanel(false)}
                      onArchiveToggle={triggerArchive}
                      onRestrictToggle={triggerRestrict}
                      sharedMedia={sharedMedia}
                    />
                  </>
                )}
              </section>
            </div>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-5 right-5 z-[80] rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl text-sm">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
