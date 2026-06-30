'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import MobileMenu from './components/mobilemenu';
import Header from './components/header';
import FeaturedAthletes from './components/featuredathletes';
import DailyChallenge from './components/dailychallenge';
import PostCard from './components/postcard';
import PostModal from './components/postmodal';
import Footer from './components/Footer/Footer';
import { api } from './lib/api';
import { mapPosts } from './lib/mappers';
import { useSession } from 'next-auth/react';

export default function Home() {
  // États
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  // demoMode = true tant que le backend n'a pas répondu (données de démo affichées)
  const [demoMode, setDemoMode] = useState(true);
  const [followingMap, setFollowingMap] = useState({});
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [posting, setPosting] = useState(false);

  // Auth via NextAuth : la session vit dans un cookie httpOnly.
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const currentUserId = session?.user?.id ?? null;

  // Données des posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Marie Dupont",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      content: "Nouveau record personnel au marathon ! 3h45 💪 Les limites sont faites pour être dépassées !",
      image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop",
      likes: 156,
      comments: 23,
      isLiked: false,
      isSaved: false,
      timeAgo: "Il y a 2h",
      category: "Course"
    },
    {
      id: 2,
      author: "Thomas Martin",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      content: "Session de CrossFit intense ce matin ! Qui est motivé pour me rejoindre demain ? 🔥",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      likes: 89,
      comments: 12,
      isLiked: false,
      isSaved: false,
      timeAgo: "Il y a 4h",
      category: "Musculation"
    },
    {
      id: 3,
      author: "Sophie Bernard",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      content: "Escalade en extérieur aujourd'hui. La peur des hauteurs ? Connais pas ! 🧗‍♀️",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=600&fit=crop",
      likes: 234,
      comments: 45,
      isLiked: true,
      isSaved: false,
      timeAgo: "Il y a 6h",
      category: "Escalade"
    },
    {
      id: 4,
      author: "Lucas Petit",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      content: "100 km à vélo sous la pluie ☔ Rien ne peut m'arrêter ! #SansLimites",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
      likes: 178,
      comments: 31,
      isLiked: false,
      isSaved: true,
      timeAgo: "Il y a 8h",
      category: "Cyclisme"
    }
  ]);

  // Charge le vrai fil depuis le backend au montage de la page.
  // En cas d'échec (backend non démarré), on conserve les données de démo
  // déjà présentes ci-dessus : l'application reste utilisable hors-ligne.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getFeed();
        if (cancelled) return;
        const mapped = mapPosts(data);
        if (mapped.length > 0) {
          setPosts(mapped);
          setDemoMode(false);
        } else {
          // Backend joignable mais aucune publication encore : on quitte le
          // mode démo et on affiche un fil vide (état réel de la base).
          setPosts([]);
          setDemoMode(false);
        }
      } catch {
        // Backend injoignable → on reste en mode démo (mock déjà affiché).
        if (!cancelled) setDemoMode(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Données des athlètes en vedette
  const featuredAthletes = [
    {
      id: 1,
      name: "Julie Moreau",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie",
      achievement: "Premier Marathon",
      description: "A terminé son premier marathon en 3h32 ! 🏃‍♀️",
      badge: "🏅",
      stats: { posts: 42, followers: 1234 }
    },
    {
      id: 2,
      name: "Alex Dubois",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      achievement: "2 ans sur Sans Limites",
      description: "2ème anniversaire ! Plus de 500 défis relevés 🎉",
      badge: "🎂",
      stats: { posts: 156, followers: 3421 }
    },
    {
      id: 3,
      name: "Camille Rousseau",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille",
      achievement: "Défi 100 jours",
      description: "100 jours d'entraînement consécutifs ! Incroyable 💪",
      badge: "🔥",
      stats: { posts: 89, followers: 2156 }
    }
  ];

  // Commentaires
  const [allComments, setAllComments] = useState({
    1: [
      { id: 1, author: "Paul Laurent", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul", text: "Bravo ! Quel temps incroyable 👏", timeAgo: "Il y a 1h" },
      { id: 2, author: "Emma Blanc", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", text: "Impressionnant ! Tu as fait quoi comme préparation ?", timeAgo: "Il y a 45min" },
      { id: 3, author: "Lucas Petit", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas2", text: "Félicitations ! Prochain objectif sous les 3h30 ? 💪", timeAgo: "Il y a 30min" }
    ],
    2: [
      { id: 1, author: "Sophie Bernard", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", text: "Je viens demain ! À quelle heure ?", timeAgo: "Il y a 2h" },
      { id: 2, author: "Marie Dupont", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie", text: "J'adore le CrossFit ! Bon courage 🔥", timeAgo: "Il y a 1h" }
    ],
    3: [
      { id: 1, author: "Thomas Martin", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas", text: "Quelle vue magnifique ! C'était où ?", timeAgo: "Il y a 3h" },
      { id: 2, author: "Julie Moreau", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie", text: "J'ai toujours voulu essayer l'escalade 🧗‍♀️", timeAgo: "Il y a 2h" },
      { id: 3, author: "Alex Dubois", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", text: "Respect total ! 👊", timeAgo: "Il y a 1h" }
    ],
    4: [
      { id: 1, author: "Camille Rousseau", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille", text: "100 km sous la pluie ?! Tu es fou ! 😱", timeAgo: "Il y a 4h" },
      { id: 2, author: "Paul Laurent", authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul", text: "Quel mental ! Bravo champion 🚴", timeAgo: "Il y a 3h" }
    ]
  });

  // Fonctions
  const toggleLike = (postId) => {
    const current = posts.find((p) => p.id === postId);
    const willLike = current ? !current.isLiked : true;

    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
    
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        isLiked: !selectedPost.isLiked,
        likes: selectedPost.isLiked ? selectedPost.likes - 1 : selectedPost.likes + 1
      });
    }

    // Synchronisation backend (uniquement sur des posts réels + utilisateur connecté).
    if (!demoMode && isLoggedIn) {
      const action = willLike ? api.likePost(postId) : api.unlikePost(postId);
      action.catch(() => {
        /* Échec silencieux : on garde l'affichage optimiste pour ne pas gêner l'UX. */
      });
    }
  };

  const toggleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
    
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        isSaved: !selectedPost.isSaved
      });
    }
  };

  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        author: "Vous",
        authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        text: newComment,
        timeAgo: "À l'instant"
      };
      
      setAllComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj]
      }));
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
      
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          comments: selectedPost.comments + 1
        });
      }
      
      setNewComment('');

      // Persiste le commentaire côté backend si connecté + post réel.
      if (!demoMode && isLoggedIn) {
        api.addComment(postId, newCommentObj.text).catch(() => {
          /* Échec silencieux : le commentaire reste affiché localement. */
        });
      }
    }
  };

  // Créer une publication (#1). create() ne renvoyant pas author/_count, on
  // recharge le fil après coup pour un affichage propre.
  const handleCreatePost = async () => {
    if (!isLoggedIn) { alert('Connecte-toi pour publier.'); return; }
    if (!draft.title.trim() && !draft.content.trim()) return;
    setPosting(true);
    try {
      await api.createPost({
        title: draft.title.trim() || undefined,
        content: draft.content.trim() || undefined,
      });
      const data = await api.getFeed();
      setPosts(mapPosts(data));
      setDemoMode(false);
      setDraft({ title: '', content: '' });
    } catch (e) {
      alert(e.message || 'Échec de la publication.');
    } finally {
      setPosting(false);
    }
  };

  // Supprimer une de ses publications (#2). Le backend renvoie 404 si ce n'est pas la tienne.
  const handleDelete = async (postId) => {
    try {
      await api.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      if (selectedPost && selectedPost.id === postId) setSelectedPost(null);
    } catch (e) {
      alert(e.message || 'Suppression impossible.');
    }
  };

  // Suivre / ne plus suivre l'auteur d'un post (#5). Affichage optimiste + revert si erreur.
  const handleToggleFollow = async (authorId, shouldFollow) => {
    setFollowingMap((m) => ({ ...m, [authorId]: shouldFollow }));
    try {
      if (shouldFollow) await api.follow(authorId);
      else await api.unfollow(authorId);
    } catch (e) {
      setFollowingMap((m) => ({ ...m, [authorId]: !shouldFollow }));
      alert(e.message || 'Action impossible.');
    }
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

        <main className="flex-1 overflow-y-auto px-4 lg:px-0">
          <div className="max-w-2xl mx-auto pt-4 lg:pt-6">
            {demoMode && (
              <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                Mode démonstration : le backend n'est pas connecté. Les publications
                affichées sont des données d'exemple. Démarrez l'API pour
                voir le vrai fil d'actualité.
              </div>
            )}
            <FeaturedAthletes athletes={featuredAthletes} />
            <DailyChallenge />

            {!demoMode && isLoggedIn && (
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-3 lg:p-4 mb-4 lg:mb-6 shadow-lg">
                <input
                  className="w-full mb-2 outline-none font-bold text-[#0047AB] placeholder-gray-400"
                  placeholder="Titre (optionnel)"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
                <textarea
                  className="w-full outline-none resize-none text-gray-800 placeholder-gray-400"
                  rows={2}
                  placeholder="Quoi de neuf ? Partagez votre perf 💪"
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleCreatePost}
                    disabled={posting}
                    className="bg-[#0047AB] hover:bg-[#003a8c] text-white rounded-full px-5 py-2 font-bold disabled:opacity-50 transition-colors"
                  >
                    {posting ? 'Publication…' : 'Publier'}
                  </button>
                </div>
              </div>
            )}
            
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
                onOpenModal={setSelectedPost}
                currentUserId={currentUserId}
                isFollowing={!!followingMap[post.authorId]}
                onDelete={!demoMode && isLoggedIn ? handleDelete : undefined}
                onToggleFollow={!demoMode && isLoggedIn ? handleToggleFollow : undefined}
              />
            ))}
          </div>
          <Footer />
        </main>
      </div>

      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onLike={toggleLike}
        onSave={toggleSave}
        comments={allComments}
        newComment={newComment}
        setNewComment={setNewComment}
        onAddComment={handleAddComment}
      />
    </div>
  );
}