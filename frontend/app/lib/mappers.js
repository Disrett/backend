// =============================================================================
//  Mappers — adaptent les données du backend au format attendu par l'UI
// -----------------------------------------------------------------------------
//  Les composants existants (PostCard, NotificationItem...) ont été écrits pour
//  des objets « mock » d'une forme précise. Plutôt que de réécrire tous les
//  composants, on convertit ici les réponses du backend vers cette même forme.
//  Avantage : aucun composant de présentation n'est cassé.
// =============================================================================

/** Avatar de secours (même service que les données mock d'origine). */
function fallbackAvatar(seed) {
  const safeSeed = encodeURIComponent(seed || 'Athlete');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeSeed}`;
}

/** Transforme une date ISO en libellé relatif (« Il y a 2h »). */
export function timeAgo(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days}j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Il y a ${weeks} sem`;
  return date.toLocaleDateString('fr-FR');
}

// ---------------------------------------------------------------------------
//  POSTS
// ---------------------------------------------------------------------------
/**
 * Convertit un post du backend (GET /api/posts) vers le format PostCard.
 * Backend : { id, title, content, imageUrl, createdAt, author:{username,name,avatarUrl}, _count:{likes,comments} }
 * UI      : { id, author, authorImage, content, image, likes, comments, isLiked, isSaved, timeAgo, category }
 */
export function mapPost(p) {
  const authorName = p.author?.name || p.author?.username || 'Athlète';
  const text = [p.title, p.content].filter(Boolean).join(' — ');

  return {
    id: p.id,
    authorId: p.author?.id || null,
    authorUsername: p.author?.username || null,
    author: authorName,
    authorImage: p.author?.avatarUrl || fallbackAvatar(p.author?.username || authorName),
    content: text || '',
    image: p.imageUrl || null,
    likes: p._count?.likes ?? 0,
    comments: p._count?.comments ?? 0,
    // Le feed public ne dit pas si l'utilisateur courant a déjà liké / sauvegardé.
    // On part de l'état neutre ; le like est ensuite géré de façon optimiste.
    isLiked: false,
    isSaved: false,
    timeAgo: timeAgo(p.createdAt),
    // Le sport n'est pas renvoyé par le feed actuel → libellé générique.
    category: 'Sport',
  };
}

export function mapPosts(list) {
  return Array.isArray(list) ? list.map(mapPost) : [];
}

// ---------------------------------------------------------------------------
//  NOTIFICATIONS
// ---------------------------------------------------------------------------
// Le backend utilise un enum (LIKE, COMMENT, FOLLOW, CHALLENGE, EVENT, GROUP,
// MESSAGE, SYSTEM). L'UI ne connaît que : like, comment, follow, challenge,
// badge, mention. On rabat chaque type backend sur une clé d'UI valide.
const NOTIF_TYPE_MAP = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  CHALLENGE: 'challenge',
  EVENT: 'challenge',
  GROUP: 'challenge',
  MESSAGE: 'comment',
  SYSTEM: 'badge',
};

// Phrase d'action affichée à côté du nom de l'auteur.
const NOTIF_SENTENCE = {
  LIKE: 'a aimé votre publication',
  COMMENT: 'a commenté votre publication',
  FOLLOW: 'a commencé à vous suivre',
  CHALLENGE: 'progression sur un défi',
  EVENT: 'rappel d’un événement',
  GROUP: 'nouvelle activité dans un groupe',
  MESSAGE: 'vous a envoyé un message',
  SYSTEM: 'notification système',
};

/**
 * Convertit une notification backend (GET /api/notifications) vers le format UI.
 * Backend : { id, type, read, content, createdAt, actor:{username,name,avatarUrl} }
 */
export function mapNotification(n) {
  const actorName = n.actor?.name || n.actor?.username || 'SANSLimites';
  return {
    id: n.id,
    type: NOTIF_TYPE_MAP[n.type] || 'badge',
    read: Boolean(n.read),
    timeAgo: timeAgo(n.createdAt),
    author: actorName,
    authorImage: n.actor?.avatarUrl
      ? n.actor.avatarUrl
      : n.actor?.username
        ? fallbackAvatar(n.actor.username)
        : null,
    content: NOTIF_SENTENCE[n.type] || 'nouvelle notification',
    detail: n.content || null,
  };
}

export function mapNotifications(list) {
  return Array.isArray(list) ? list.map(mapNotification) : [];
}
