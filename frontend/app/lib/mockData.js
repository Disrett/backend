export const mockUser = {
  name: 'Alexandre Martin',
  username: '@alexandre.martin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre',
  bio: 'Passionné de cyclisme et de trail 🚴 · Coach sportif certifié · #SansLimites',
  location: 'Lyon, France',
  sport: 'Cyclisme & Trail',
  objectives: [
    { label: 'Courir 500 km cette année', pct: 72 },
    { label: 'Terminer un triathlon', pct: 45 },
  ],
  challenges: [
    { name: 'Juin 100 km',  pct: 60, icon: '🏆' },
    { name: 'Gran Fondo',   pct: 40, icon: '🚴' },
    { name: 'Morning Club', pct: 80, icon: '🌅' },
    { name: 'KOM Hunter',   pct: 25, icon: '⛰️' },
  ],
};

export const mockPublications = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop',
    title: '100 km sous la pluie ☔',
    likes: 178,
    comments: 31,
    timeAgo: 'Il y a 2j',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&h=400&fit=crop',
    title: 'Marathon du dimanche 🏃',
    likes: 134,
    comments: 18,
    timeAgo: 'Il y a 5j',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    title: 'Session CrossFit intense 🔥',
    likes: 89,
    comments: 12,
    timeAgo: 'Il y a 1sem',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=400&fit=crop',
    title: 'Escalade en extérieur 🧗',
    likes: 210,
    comments: 40,
    timeAgo: 'Il y a 2sem',
  },
];
