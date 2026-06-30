'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, Calendar, TrendingUp, Plus, Star, Flame, Award, Lock, Globe, ArrowLeft, Clock, CheckCircle, UserPlus, MessageCircle, Share2, Heart } from 'lucide-react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import Footer from '../components/Footer/Footer';

// 👥 FAUX MEMBRES pour la vue détail
const fakeMembers = [
  { name: "Julie M.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie", role: "Organisateur", joinedAgo: "Fondatrice" },
  { name: "Lucas P.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", role: "Co-organisateur", joinedAgo: "Il y a 3 mois" },
  { name: "Sophie B.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", role: "Membre", joinedAgo: "Il y a 2 mois" },
  { name: "Thomas M.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas", role: "Membre", joinedAgo: "Il y a 6 semaines" },
  { name: "Camille R.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille", role: "Membre", joinedAgo: "Il y a 1 mois" },
  { name: "Alex D.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", role: "Membre", joinedAgo: "Il y a 3 semaines" },
  { name: "Marie L.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie", role: "Membre", joinedAgo: "Il y a 2 semaines" },
  { name: "Paul H.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul", role: "Membre", joinedAgo: "Il y a 1 semaine" },
  { name: "Emma V.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", role: "Membre", joinedAgo: "Il y a 5 jours" },
  { name: "Nathan G.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan", role: "Membre", joinedAgo: "Il y a 2 jours" },
];

// 📊 DONNÉES DES GROUPES
const groups = [
  {
    id: 1,
    name: "Marathon Paris 2025 - Prépa Collective",
    slug: "marathon-paris-2025",
    sport: "Running",
    category: "Préparation compétition",
    description: "Groupe de préparation au marathon de Paris 2025. On se retrouve 3x par semaine pour des sorties longues, du fractionné et de la récup. Ambiance cool et bienveillante.",
    longDescription: "Rejoins notre communauté de coureurs passionnés qui se préparent ensemble pour le Marathon de Paris 2025 ! Que tu vises un chrono ou simplement finir ton premier marathon, tu es le/la bienvenu(e).\n\nNotre programme inclut :\n• Sorties longues le dimanche matin (15 à 35km progressifs)\n• Séances de fractionné le mardi soir (piste ou nature)\n• Footing récup le jeudi\n• Un plan d'entraînement personnalisable\n• Un groupe WhatsApp pour se motiver au quotidien\n• Des conseils nutrition et récupération\n\nOn court ensemble, on progresse ensemble. Personne n'est laissé derrière !",
    coverImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=400&fit=crop",
    location: { city: "Paris", district: "11e" },
    members: { current: 45, max: 60 },
    level: "Tous niveaux",
    frequency: "3x/semaine",
    nextEvent: { title: "Sortie longue 25km", date: "Dimanche 8h00" },
    upcomingEvents: [
      { title: "Sortie longue 25km", date: "Dimanche 8h00", location: "Bois de Vincennes" },
      { title: "Fractionné 10x400m", date: "Mardi 19h00", location: "Piste Charléty" },
      { title: "Footing récup 8km", date: "Jeudi 18h30", location: "Canal Saint-Martin" },
    ],
    badges: ["🔥 Très actif", "⭐ Vérifié"],
    isPrivate: false,
    featured: true,
    gradient: "from-[#0047AB] to-[#4fb3ff]",
    organizer: { name: "Julie Moreau", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie" },
    tags: ["Running", "Marathon", "Paris", "Préparation"],
    rules: ["Respect des allures de groupe", "Prévenir en cas d'absence", "Bonne humeur obligatoire 😄"],
    createdAt: "Septembre 2024"
  },
  {
    id: 2,
    name: "Futsal Squad Bordeaux",
    slug: "futsal-squad-bordeaux",
    sport: "Football",
    category: "Sports collectifs",
    description: "Équipe de futsal à Bordeaux cherchant 4 joueurs pour compléter l'équipe. Matchs le samedi soir, ambiance compétitive mais fun. Niveau intermédiaire requis.",
    longDescription: "On est une bande de potes qui joue au futsal tous les samedis soir à Bordeaux. On cherche 4 joueurs supplémentaires pour avoir un effectif solide et pouvoir tourner.\n\nCe qu'on propose :\n• Match tous les samedis de 19h30 à 21h00\n• Salle réservée au gymnase des Chartrons\n• Ambiance compétitive mais fair-play\n• Possibilité de participer à des tournois locaux\n• Troisième mi-temps au bar d'en face 🍺\n\nNiveau intermédiaire minimum requis — on veut des matchs de qualité !",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    location: { city: "Bordeaux", district: "Centre" },
    members: { current: 12, max: 16 },
    level: "Intermédiaire",
    frequency: "1x/semaine",
    nextEvent: { title: "Match amical", date: "Samedi 19h30" },
    upcomingEvents: [
      { title: "Match amical", date: "Samedi 19h30", location: "Gymnase des Chartrons" },
      { title: "Tournoi inter-quartiers", date: "Samedi prochain 14h00", location: "Complexe Stéhélin" },
    ],
    badges: ["🆕 Nouveau", "📍 Près de toi"],
    isPrivate: false,
    featured: true,
    gradient: "from-[#0a3b8f] to-[#ff9b54]",
    organizer: { name: "Lucas Petit", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" },
    tags: ["Football", "Futsal", "Bordeaux", "Équipe"],
    rules: ["Ramener ses chaussures de salle", "Participation aux frais de salle (5€/match)", "Prévenir 24h avant si absent"],
    createdAt: "Janvier 2025"
  },
  {
    id: 3,
    name: "Trail Crew Nature",
    slug: "trail-crew-nature",
    sport: "Trail",
    category: "Découverte",
    description: "Sorties trail tous les week-ends dans différents spots autour de Lyon. On privilégie les beaux paysages et la convivialité. Débutants bienvenus !",
    longDescription: "Envie de courir en pleine nature autour de Lyon ? Rejoins le Trail Crew Nature ! Chaque week-end, on explore un nouveau spot : Mont d'Or, Pilat, Beaujolais, Bugey...\n\nNotre philosophie :\n• Le plaisir avant la performance\n• Découverte de nouveaux sentiers chaque semaine\n• Rythme adapté aux débutants (personne n'est laissé derrière)\n• Covoiturage organisé pour les spots éloignés\n• Pique-nique ou brunch post-sortie\n\nOn court entre 10 et 20km selon les sorties, avec 300 à 800m de D+. Parfait pour s'initier au trail !",
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop",
    location: { city: "Lyon", district: "Métropole" },
    members: { current: 28, max: 40 },
    level: "Débutant",
    frequency: "1x/semaine",
    nextEvent: { title: "Trail 15km Pilat", date: "Dimanche 9h00" },
    upcomingEvents: [
      { title: "Trail 15km Pilat", date: "Dimanche 9h00", location: "Crêt de l'Œillon" },
      { title: "Trail 12km Mont d'Or", date: "Dimanche prochain 9h00", location: "Parking Mont Cindre" },
    ],
    badges: ["🌲 Nature", "👥 Convivial"],
    isPrivate: false,
    featured: true,
    gradient: "from-[#053d91] to-[#6fb577]",
    organizer: { name: "Sophie Bernard", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" },
    tags: ["Trail", "Nature", "Lyon", "Week-end"],
    rules: ["Chaussures de trail obligatoires", "Emporter au moins 1L d'eau", "Respecter la nature (pas de déchets)"],
    createdAt: "Mars 2024"
  },
  {
    id: 4,
    name: "CrossFit Challenge 30 jours",
    slug: "crossfit-challenge-30",
    sport: "CrossFit",
    category: "Challenge",
    description: "Challenge de 30 jours pour se remettre en forme ! WODs quotidiens, suivi de progression, groupe WhatsApp pour se motiver. On démarre le 1er du mois.",
    longDescription: "Prêt(e) à te transformer en 30 jours ? Ce challenge est fait pour toi !\n\nChaque jour tu recevras un WOD (Workout of the Day) adapté à ton niveau. Pas besoin de matériel, tout se fait au poids du corps ou avec du matériel basique.\n\nLe programme :\n• WOD quotidien publié à 6h00\n• 3 niveaux de difficulté (débutant, intermédiaire, avancé)\n• Suivi de progression avec tableau partagé\n• Lives Instagram hebdomadaires pour les démos\n• Groupe WhatsApp pour la motivation\n\nLe prochain challenge démarre le 1er du mois. Inscris-toi maintenant !",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop",
    location: { city: "En ligne", district: "" },
    members: { current: 67, max: 100 },
    level: "Tous niveaux",
    frequency: "Quotidien",
    nextEvent: { title: "Début du challenge", date: "Lundi prochain" },
    upcomingEvents: [
      { title: "Début du challenge", date: "Lundi prochain", location: "En ligne" },
      { title: "Live démo semaine 1", date: "Mercredi 19h00", location: "Instagram Live" },
    ],
    badges: ["🔥 Très actif", "💪 Challenge"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#0a387f] to-[#ffa154]",
    organizer: { name: "Thomas Martin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas" },
    tags: ["CrossFit", "Challenge", "Online", "30jours"],
    rules: ["Poster ses résultats chaque jour", "Encourager les autres participants", "Pas de triche sur les reps 😉"],
    createdAt: "Novembre 2024"
  },
  {
    id: 5,
    name: "Yoga Sunrise Squad",
    slug: "yoga-sunrise-squad",
    sport: "Yoga",
    category: "Bien-être",
    description: "Séances de yoga au lever du soleil, 2x par semaine dans un parc de Marseille. Tous niveaux, tapis fournis. Parfait pour bien démarrer la journée !",
    longDescription: "Imagine commencer ta journée avec une séance de yoga face au soleil levant, dans un cadre magnifique à Marseille.\n\nLe Yoga Sunrise Squad t'accueille 2 fois par semaine :\n• Mardi et jeudi à 6h30 (été) / 7h00 (hiver)\n• Parc Borély ou Plage du Prado selon la météo\n• Séances de Vinyasa, Hatha et Yin yoga en alternance\n• Tapis et accessoires fournis\n• Thé et fruits partagés après la séance\n\nAucune expérience requise, on adapte les postures à chacun(e). Viens comme tu es !",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop",
    location: { city: "Marseille", district: "8e" },
    members: { current: 19, max: 25 },
    level: "Tous niveaux",
    frequency: "2x/semaine",
    nextEvent: { title: "Vinyasa flow", date: "Mercredi 6h30" },
    upcomingEvents: [
      { title: "Vinyasa flow", date: "Mercredi 6h30", location: "Parc Borély" },
      { title: "Hatha doux", date: "Vendredi 6h30", location: "Plage du Prado" },
    ],
    badges: ["🌅 Matinal", "🧘 Zen"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#1a4ea5] to-[#ffb978]",
    organizer: { name: "Marie Dupont", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie" },
    tags: ["Yoga", "Marseille", "Matin", "Bien-être"],
    rules: ["Arriver 5 min avant le début", "Silence pendant la pratique", "Ramener sa gourde d'eau"],
    createdAt: "Juin 2024"
  },
  {
    id: 6,
    name: "Basket 3x3 Street Lyon",
    slug: "basket-3x3-lyon",
    sport: "Basketball",
    category: "Sports collectifs",
    description: "Groupe de basket 3x3 qui se retrouve sur les playgrounds de Lyon. Niveau confirmé, ambiance street culture. On organise aussi des mini-tournois.",
    longDescription: "Le street basket à Lyon, c'est nous ! On se retrouve sur les meilleurs playgrounds de la ville pour des sessions de 3x3 intenses.\n\nCe qu'on fait :\n• Sessions régulières mardi et vendredi soir\n• Rotation entre plusieurs playgrounds (Part-Dieu, Gerland, Confluence)\n• Mini-tournois mensuels avec classement\n• Ambiance street culture, musique, good vibes\n• Niveau confirmé — on joue pour de vrai\n\nSi tu as un bon handle et un jump shot correct, viens nous montrer ce que tu sais faire !",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
    location: { city: "Lyon", district: "7e" },
    members: { current: 24, max: 30 },
    level: "Avancé",
    frequency: "2x/semaine",
    nextEvent: { title: "Session playground", date: "Vendredi 18h30" },
    upcomingEvents: [
      { title: "Session playground", date: "Vendredi 18h30", location: "Playground Part-Dieu" },
      { title: "Mini-tournoi mensuel", date: "Samedi prochain 14h00", location: "Terrain Gerland" },
    ],
    badges: ["🏀 Street", "🔥 Actif"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#0b2c5d] to-[#ff7a00]",
    organizer: { name: "Alex Dubois", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    tags: ["Basketball", "3x3", "Lyon", "Street"],
    rules: ["Ramener son ballon si possible", "Fair-play sur le terrain", "Pas de contestation abusive"],
    createdAt: "Avril 2024"
  },
  {
    id: 7,
    name: "Natation Technique & Perf",
    slug: "natation-technique",
    sport: "Natation",
    category: "Perfectionnement",
    description: "Groupe axé sur l'amélioration technique et la performance en natation. Séances encadrées par un coach diplômé. Créneaux piscine municipale réservés.",
    longDescription: "Tu nages régulièrement mais tu veux passer un cap ? Notre groupe Natation Technique & Perf est fait pour toi.\n\nEncadré par Camille, coach diplômé d'État :\n• 2 séances par semaine (mardi et jeudi 19h-20h30)\n• Créneaux réservés à la piscine municipale de Toulouse\n• Travail technique : crawl, dos, brasse, papillon\n• Éducatifs et drill pour améliorer l'efficacité\n• Tests chronométrés mensuels pour mesurer la progression\n\nNiveau requis : savoir nager 400m crawl sans s'arrêter.",
    coverImage: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&h=400&fit=crop",
    location: { city: "Toulouse", district: "Centre" },
    members: { current: 15, max: 20 },
    level: "Intermédiaire",
    frequency: "2x/semaine",
    nextEvent: { title: "Technique crawl", date: "Mardi 19h00" },
    upcomingEvents: [
      { title: "Technique crawl", date: "Mardi 19h00", location: "Piscine Nakache" },
      { title: "Séance papillon + dos", date: "Jeudi 19h00", location: "Piscine Nakache" },
    ],
    badges: ["⭐ Coach certifié", "🏊 Technique"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#0148ad] to-[#6fd3ff]",
    organizer: { name: "Camille Rousseau", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille" },
    tags: ["Natation", "Toulouse", "Coach", "Technique"],
    rules: ["Maillot de bain, lunettes et bonnet obligatoires", "Ponctualité requise", "Participation aux frais de bassin (8€/mois)"],
    createdAt: "Octobre 2024"
  },
  {
    id: 8,
    name: "Escalade Bloc Crew Paris",
    slug: "escalade-bloc-paris",
    sport: "Escalade",
    category: "Loisir",
    description: "On grimpe ensemble 2-3 fois par semaine dans différentes salles de Paris. Ambiance cool, on s'entraide sur les projets. Débutants et confirmés mélangés.",
    longDescription: "Envie de grimper mais pas envie de le faire seul(e) ? Rejoins notre crew d'escalade bloc à Paris !\n\nOn se retrouve 2 à 3 fois par semaine dans les meilleures salles de la capitale :\n• Arkose Nation, Climb Up Porte d'Italie, MurMur Pantin\n• Sessions de 2h environ\n• On s'entraide, on se motive, on pare\n• Tous niveaux : du 3a au 7c+\n• Sorties falaise occasionnelles (Fontainebleau)\n\nL'ambiance est cool et bienveillante. On partage aussi des tips, des vidéos et des astuces sur le groupe.",
    coverImage: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=400&fit=crop",
    location: { city: "Paris", district: "Multi" },
    members: { current: 31, max: 40 },
    level: "Tous niveaux",
    frequency: "2-3x/semaine",
    nextEvent: { title: "Session Arkose", date: "Jeudi 19h30" },
    upcomingEvents: [
      { title: "Session Arkose Nation", date: "Jeudi 19h30", location: "Arkose Nation" },
      { title: "Session Climb Up", date: "Samedi 10h00", location: "Climb Up Porte d'Italie" },
      { title: "Sortie Fontainebleau", date: "Dimanche prochain 9h00", location: "Forêt de Fontainebleau" },
    ],
    badges: ["🧗 Bloc", "👥 Convivial"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#003a8c] to-[#ffb066]",
    organizer: { name: "Paul Laurent", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul" },
    tags: ["Escalade", "Bloc", "Paris", "Salle"],
    rules: ["Chaussons d'escalade obligatoires", "On pare ses potes", "Bonne humeur requise 🤙"],
    createdAt: "Février 2024"
  },
  {
    id: 9,
    name: "Vélo Gravel Aventure",
    slug: "velo-gravel-aventure",
    sport: "Cyclisme",
    category: "Découverte",
    description: "Sorties gravel le dimanche, exploration de nouveaux itinéraires autour de Strasbourg. Rythme cool, pauses café. Niveau intermédiaire, 60-80km par sortie.",
    longDescription: "Le gravel, c'est la liberté ! On roule tous les dimanches autour de Strasbourg, entre chemins de vignes, forêts et petites routes alsaciennes.\n\nNotre programme :\n• Sortie chaque dimanche matin (départ 8h30)\n• Itinéraires de 60 à 80km avec traces GPX partagées\n• Rythme cool (25-28 km/h de moyenne)\n• Pause café/viennoiseries à mi-parcours\n• Covoiturage organisé pour les sorties plus lointaines\n\nVélo gravel ou VTT à pneus slick requis. On roule ensemble, on finit ensemble !",
    coverImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=400&fit=crop",
    location: { city: "Strasbourg", district: "Région" },
    members: { current: 18, max: 25 },
    level: "Intermédiaire",
    frequency: "1x/semaine",
    nextEvent: { title: "Gravel 70km Vosges", date: "Dimanche 8h30" },
    upcomingEvents: [
      { title: "Gravel 70km Vosges", date: "Dimanche 8h30", location: "Place de la Gare" },
      { title: "Gravel 65km Route des vins", date: "Dimanche prochain 8h30", location: "Place de la Gare" },
    ],
    badges: ["🚴 Gravel", "☕ Pausé"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#053d91] to-[#ffab63]",
    organizer: { name: "Emma Blanc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
    tags: ["Vélo", "Gravel", "Strasbourg", "Week-end"],
    rules: ["Casque obligatoire", "Vélo en bon état", "Kit de réparation crevaison"],
    createdAt: "Mai 2024"
  },
  {
    id: 10,
    name: "Run Crew Bordeaux",
    slug: "run-crew-bordeaux",
    sport: "Running",
    category: "Communauté",
    description: "Le plus gros run crew de Bordeaux ! Sorties tous les mardis et jeudis soir, ambiance festive après la course. Tous niveaux, 5-10km, personne n'est laissé derrière.",
    longDescription: "Bienvenue chez le Run Crew Bordeaux, la plus grosse communauté de runners de la ville ! 🏃‍♂️🏃‍♀️\n\nOn court ensemble, on vibre ensemble :\n• Mardi et jeudi à 19h00, départ des Quinconces\n• Parcours de 5 à 10km le long des quais\n• Tous les niveaux : de 5'30 à 7'30/km\n• Afterwork post-run dans un bar partenaire\n• Événements spéciaux : runs nocturnes, runs thématiques\n\nPlus qu'un groupe de course, c'est une vraie famille. On ne laisse personne derrière, et on finit toujours par une bière ensemble 🍺",
    coverImage: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=400&fit=crop",
    location: { city: "Bordeaux", district: "Quais" },
    members: { current: 89, max: 120 },
    level: "Tous niveaux",
    frequency: "2x/semaine",
    nextEvent: { title: "Run + afterwork", date: "Mardi 19h00" },
    upcomingEvents: [
      { title: "Run + afterwork", date: "Mardi 19h00", location: "Place des Quinconces" },
      { title: "Run nocturne spécial", date: "Jeudi 20h30", location: "Miroir d'eau" },
      { title: "Long run dimanche", date: "Dimanche 9h00", location: "Parc Bordelais" },
    ],
    badges: ["🔥 Très actif", "🎉 Festif", "👑 Populaire"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#0f4bb8] to-[#ffa75f]",
    organizer: { name: "Julie Moreau", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie2" },
    tags: ["Running", "Bordeaux", "Crew", "Afterwork"],
    rules: ["Venir avec le sourire", "Pas de pression sur les allures", "L'afterwork est fortement recommandé 😄"],
    createdAt: "Janvier 2024"
  },
  {
    id: 11,
    name: "Musculation Force Athlétique",
    slug: "muscu-force-athletique",
    sport: "Musculation",
    category: "Performance",
    description: "Groupe axé force athlétique : squat, bench, deadlift. Programmation partagée, séances communes le week-end. Niveau confirmé, ambiance sérieuse mais cool.",
    longDescription: "Tu es passionné(e) de force athlétique et tu cherches un crew pour t'entraîner ? Rejoins-nous !\n\nNotre approche :\n• Focus sur les 3 mouvements : squat, bench press, deadlift\n• Programmation partagée (cycles de 8-12 semaines)\n• Séances communes le samedi et dimanche\n• Suivi des PR et des progressions\n• Échanges techniques et vidéos de form check\n\nNiveau requis : au moins 1 an de pratique sérieuse en musculation. On est là pour se challenger et progresser ensemble !",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop",
    location: { city: "Lille", district: "Centre" },
    members: { current: 22, max: 30 },
    level: "Avancé",
    frequency: "3-4x/semaine",
    nextEvent: { title: "Test 1RM squat", date: "Samedi 14h00" },
    upcomingEvents: [
      { title: "Test 1RM squat", date: "Samedi 14h00", location: "Basic Fit Lille Centre" },
      { title: "Séance bench + accessoires", date: "Dimanche 10h00", location: "Basic Fit Lille Centre" },
    ],
    badges: ["💪 Force", "📊 Programme"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#032d74] to-[#ff8a3d]",
    organizer: { name: "Thomas Martin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas2" },
    tags: ["Musculation", "Force", "Lille", "Powerlifting"],
    rules: ["Respect du matériel", "Ranger ses poids", "Pas d'ego lifting"],
    createdAt: "Juillet 2024"
  },
  {
    id: 12,
    name: "Boxe Sparring Collectif",
    slug: "boxe-sparring",
    sport: "Boxe",
    category: "Entraînement",
    description: "Sessions de sparring et travail technique tous les mercredis soir. Salle privée à Paris 11e, encadrement coach diplômé. Niveau minimum requis : 6 mois de pratique.",
    longDescription: "Groupe de sparring pour boxeurs avec minimum 6 mois de pratique. Encadré par Alex, coach diplômé et ancien compétiteur.\n\nDéroulé d'une séance :\n• 20 min échauffement et shadow boxing\n• 30 min travail technique (combos, esquives, défense)\n• 40 min sparring (rounds de 3 min)\n• 10 min retour au calme et étirements\n\nMatériel requis : gants 14oz minimum, protège-dents, coquille (hommes), protège-tibias. Casque fourni par la salle.\n\nGroupe privé : candidature à valider par l'organisateur.",
    coverImage: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=400&fit=crop",
    location: { city: "Paris", district: "11e" },
    members: { current: 16, max: 20 },
    level: "Intermédiaire",
    frequency: "1x/semaine",
    nextEvent: { title: "Sparring + technique", date: "Mercredi 20h00" },
    upcomingEvents: [
      { title: "Sparring + technique", date: "Mercredi 20h00", location: "Salle Iron Fist, 11e" },
    ],
    badges: ["🥊 Sparring", "⭐ Coach"],
    isPrivate: true,
    featured: false,
    gradient: "from-[#0b2c5d] to-[#ff7f32]",
    organizer: { name: "Alex Dubois", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex2" },
    tags: ["Boxe", "Sparring", "Paris", "Technique"],
    rules: ["6 mois de pratique minimum", "Matériel complet obligatoire", "Contrôle des coups en sparring"],
    createdAt: "Août 2024"
  },
  {
    id: 13,
    name: "Triathlon Club Débutants",
    slug: "triathlon-debutants",
    sport: "Triathlon",
    category: "Initiation",
    description: "Groupe pour débuter le triathlon en douceur. Plan d'entraînement progressif sur 12 semaines, objectif : premier triathlon sprint. Coaching inclus, super ambiance !",
    longDescription: "Tu rêves de faire un triathlon mais tu ne sais pas par où commencer ? Ce groupe est fait pour toi !\n\nProgramme de 12 semaines :\n• 3 séances par semaine (natation, vélo, course)\n• Progression douce et adaptée\n• Coaching par Camille, triathlète confirmée\n• Briefings transitions et logistique course\n• Objectif : triathlon sprint (750m/20km/5km)\n\nCadre idyllique au bord du lac d'Annecy. Inscris-toi et franchis la ligne d'arrivée de ton premier tri !",
    coverImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=400&fit=crop",
    location: { city: "Annecy", district: "Lac" },
    members: { current: 24, max: 30 },
    level: "Débutant",
    frequency: "3x/semaine",
    nextEvent: { title: "Natation technique", date: "Lundi 18h30" },
    upcomingEvents: [
      { title: "Natation technique", date: "Lundi 18h30", location: "Piscine des Marquisats" },
      { title: "Sortie vélo", date: "Mercredi 18h00", location: "Tour du lac" },
      { title: "Course à pied", date: "Vendredi 18h00", location: "Pâquier" },
    ],
    badges: ["🏊🚴🏃 Tri", "📚 Programme"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#0047AB] to-[#00d4ff]",
    organizer: { name: "Camille Rousseau", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille2" },
    tags: ["Triathlon", "Débutant", "Annecy", "Initiation"],
    rules: ["Savoir nager 200m", "Avoir un vélo en état de rouler", "Motivation et régularité"],
    createdAt: "Décembre 2024"
  },
  {
    id: 14,
    name: "Danse Hip-Hop Crew",
    slug: "danse-hiphop-crew",
    sport: "Danse",
    category: "Loisir",
    description: "Crew de danse hip-hop à Lyon. On répète 2x par semaine, on travaille des chorés et on participe à des battles. Niveau intermédiaire, style old school et new school.",
    longDescription: "Le Hip-Hop Crew de Lyon recrute ! Si tu kiffes danser et que tu as déjà des bases en hip-hop, rejoins notre crew.\n\nCe qu'on fait :\n• 2 répétitions par semaine (mardi et jeudi 20h-22h)\n• Travail de chorégraphies collectives\n• Freestyle et cypher sessions\n• Participation à des battles et showcases\n• Mix de styles : popping, locking, breaking, new style\n\nStudio de danse dans le 3e arrondissement. Ambiance feu, énergie positive, et beaucoup de sueur !",
    coverImage: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=400&fit=crop",
    location: { city: "Lyon", district: "3e" },
    members: { current: 14, max: 18 },
    level: "Intermédiaire",
    frequency: "2x/semaine",
    nextEvent: { title: "Répét chorée battle", date: "Jeudi 20h00" },
    upcomingEvents: [
      { title: "Répét chorée battle", date: "Jeudi 20h00", location: "Studio Danse Lyon 3e" },
      { title: "Battle inter-crews", date: "Samedi prochain 15h00", location: "MJC Monplaisir" },
    ],
    badges: ["🎵 Hip-Hop", "🔥 Crew"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#0b2c5d] to-[#ff9f6a]",
    organizer: { name: "Sophie Bernard", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie2" },
    tags: ["Danse", "Hip-Hop", "Lyon", "Chorégraphie"],
    rules: ["Ponctualité", "Tenue de danse", "Respecter les chorés collectives"],
    createdAt: "Mars 2024"
  },
  {
    id: 15,
    name: "Surf Camp Hossegor",
    slug: "surf-camp-hossegor",
    sport: "Surf",
    category: "Week-end",
    description: "Week-ends surf à Hossegor une fois par mois. On partage les frais de location de van, surf camp, et sessions à l'eau. Niveau intermédiaire, bon vibes garanties !",
    longDescription: "Chaque mois, on organise un week-end surf à Hossegor ! L'idée est simple : on part en van le vendredi soir, on surfe tout le week-end, et on rentre le dimanche soir.\n\nL'organisation :\n• 1 week-end par mois (vendredi soir → dimanche soir)\n• Covoiturage en van depuis Bordeaux/Toulouse\n• Hébergement en surf camp ou camping\n• Sessions surf matin et après-midi\n• Barbecue le samedi soir\n\nFrais partagés : ~80€ tout compris (transport, hébergement, repas). Planche en location possible sur place.\n\nNiveau intermédiaire requis (savoir passer la barre et se mettre debout).",
    coverImage: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=400&fit=crop",
    location: { city: "Hossegor", district: "Landes" },
    members: { current: 12, max: 16 },
    level: "Intermédiaire",
    frequency: "1x/mois",
    nextEvent: { title: "Week-end surf camp", date: "Sam-Dim prochain" },
    upcomingEvents: [
      { title: "Week-end surf camp", date: "Sam-Dim prochain", location: "Hossegor, La Gravière" },
    ],
    badges: ["🏄 Surf", "🚐 Road trip"],
    isPrivate: false,
    featured: false,
    gradient: "from-[#0047AB] to-[#6fe3ff]",
    organizer: { name: "Lucas Petit", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas2" },
    tags: ["Surf", "Hossegor", "Week-end", "Océan"],
    rules: ["Savoir nager", "Participation aux frais obligatoire", "Respect de l'océan et des locaux"],
    createdAt: "Avril 2024"
  }
];

// ============================================================
// COMPOSANT : VUE DÉTAIL D'UN GROUPE
// ============================================================
function GroupDetail({ group, onBack }) {
  const [joined, setJoined] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);

  const isFull = group.members.current >= group.members.max;
  const fillPercentage = (group.members.current / group.members.max) * 100;
  const displayedMembers = showAllMembers ? fakeMembers : fakeMembers.slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      {/* Bouton Retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#0047AB] font-semibold mb-6 hover:text-[#FFA75F] transition-colors group/back"
      >
        <ArrowLeft size={20} className="group-hover/back:-translate-x-1 transition-transform" />
        Retour aux groupes
      </button>

      {/* Cover image */}
      <div className="relative h-56 lg:h-72 rounded-2xl overflow-hidden mb-6">
        <img
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${group.gradient} opacity-70`} />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {group.badges.map((badge, i) => (
              <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#0047AB] backdrop-blur-sm">
                {badge}
              </span>
            ))}
            {group.isPrivate && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                <Lock size={12} /> Privé
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{group.name}</h1>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => { if (!isFull) setJoined(!joined); }}
          disabled={isFull && !joined}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            joined
              ? 'bg-green-500 text-white'
              : isFull
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#0047AB] text-white hover:bg-[#FFA75F] shadow-lg hover:shadow-xl'
          }`}
        >
          {joined ? <CheckCircle size={18} /> : <UserPlus size={18} />}
          {joined ? 'Inscrit !' : isFull ? 'Complet' : group.isPrivate ? 'Demander à rejoindre' : 'Rejoindre le groupe'}
        </button>
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-colors ${
            liked ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 text-gray-600 hover:border-[#0047AB] hover:text-[#0047AB]'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          {liked ? 'Sauvegardé' : 'Sauvegarder'}
        </button>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:border-[#0047AB] hover:text-[#0047AB] transition-colors">
          <Share2 size={18} />
          Partager
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos rapides */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-[#0047AB]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MapPin size={18} className="text-[#0047AB]" />
                </div>
                <p className="text-xs text-gray-500">Lieu</p>
                <p className="text-sm font-bold text-gray-800">{group.location.city}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#FFA75F]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Calendar size={18} className="text-[#FFA75F]" />
                </div>
                <p className="text-xs text-gray-500">Fréquence</p>
                <p className="text-sm font-bold text-gray-800">{group.frequency}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#0047AB]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp size={18} className="text-[#0047AB]" />
                </div>
                <p className="text-xs text-gray-500">Niveau</p>
                <p className="text-sm font-bold text-gray-800">{group.level}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#FFA75F]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock size={18} className="text-[#FFA75F]" />
                </div>
                <p className="text-xs text-gray-500">Créé en</p>
                <p className="text-sm font-bold text-gray-800">{group.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Description complète */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-4">À propos du groupe</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {group.longDescription || group.description}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {group.tags.map((tag, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Prochains événements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-4">Prochains événements</h2>
            <div className="space-y-3">
              {(group.upcomingEvents || []).map((event, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[#0047AB]/5 hover:bg-[#0047AB]/10 transition-colors">
                  <div className="w-10 h-10 bg-[#0047AB] rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                    {event.location && (
                      <p className="text-xs text-[#FFA75F] font-semibold mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Règles du groupe */}
          {group.rules && group.rules.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0047AB] text-lg mb-4">Règles du groupe</h2>
              <div className="space-y-3">
                {group.rules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FFA75F]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#FFA75F]">{i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          {/* Organisateur */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-4">Organisateur</h2>
            <div className="flex items-center gap-3">
              <img
                src={group.organizer.avatar}
                alt={group.organizer.name}
                className="w-14 h-14 rounded-full ring-2 ring-[#0047AB]/20"
              />
              <div>
                <p className="font-bold text-gray-800">{group.organizer.name}</p>
                <p className="text-xs text-[#FFA75F] font-semibold">Créateur du groupe</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl border-2 border-[#0047AB] text-[#0047AB] font-semibold text-sm hover:bg-[#0047AB]/5 transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              Contacter
            </button>
          </div>

          {/* Membres */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0047AB] text-lg">Membres</h2>
              <span className="text-sm font-semibold text-gray-500">
                {group.members.current}/{group.members.max}
              </span>
            </div>

            {/* Barre de remplissage */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all ${
                  fillPercentage >= 90 ? 'bg-red-500' : fillPercentage >= 70 ? 'bg-orange-500' : 'bg-[#0047AB]'
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>

            {/* Liste des membres */}
            <div className="space-y-3">
              {displayedMembers.map((member, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-9 h-9 rounded-full ring-1 ring-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.joinedAgo}</p>
                  </div>
                  {member.role !== 'Membre' && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0047AB]/10 text-[#0047AB] shrink-0">
                      {member.role === 'Organisateur' ? '👑 Orga' : '⭐ Co-orga'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {fakeMembers.length > 6 && (
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="w-full mt-4 text-sm font-semibold text-[#0047AB] hover:text-[#FFA75F] transition-colors"
              >
                {showAllMembers ? 'Voir moins' : `Voir tous les membres (${fakeMembers.length})`}
              </button>
            )}
          </div>

          {/* Sport & Catégorie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-3">Infos</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Sport</span>
                <span className="text-sm font-bold text-[#0047AB] px-3 py-1 bg-[#0047AB]/10 rounded-full">{group.sport}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Catégorie</span>
                <span className="text-sm font-bold text-[#FFA75F] px-3 py-1 bg-[#FFA75F]/10 rounded-full">{group.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Visibilité</span>
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  {group.isPrivate ? <><Lock size={14} /> Privé</> : <><Globe size={14} /> Public</>}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : CARD DE GROUPE (cliquable)
// ============================================================
function GroupCard({ group, onClick }) {
  const isFull = group.members.current >= group.members.max;
  const fillPercentage = (group.members.current / group.members.max) * 100;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
    >
      {/* Image de couverture */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${group.gradient} opacity-80`} />

        {/* Badges sur l'image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {group.badges.map((badge, index) => (
            <span
              key={index}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#0047AB] backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
          {group.isPrivate && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
              <Lock size={12} />
              Privé
            </span>
          )}
        </div>

        {/* Catégorie */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFA75F] text-white shadow-lg">
            {group.category}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        {/* Sport tag */}
        <div className="mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB]">
            {group.sport}
          </span>
        </div>

        {/* Titre */}
        <h3 className="font-bold text-[#0047AB] text-lg mb-2 line-clamp-2 min-h-[56px]">
          {group.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
          {group.description}
        </p>

        {/* Infos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-[#FFA75F] shrink-0" />
            <span className="truncate">{group.location.city}{group.location.district ? `, ${group.location.district}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-[#FFA75F] shrink-0" />
            <span className="truncate">{group.frequency} • {group.level}</span>
          </div>
        </div>

        {/* Prochain événement */}
        {group.nextEvent && (
          <div className="bg-[#0047AB]/5 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-[#0047AB] mb-1">Prochain événement</p>
            <p className="text-sm font-bold text-gray-800">{group.nextEvent.title}</p>
            <p className="text-xs text-gray-500 mt-1">{group.nextEvent.date}</p>
          </div>
        )}

        {/* Membres */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#0047AB]" />
              <span className="font-semibold text-gray-800">
                {group.members.current} / {group.members.max} membres
              </span>
            </div>
            {isFull && (
              <span className="text-xs font-semibold text-red-500">Complet</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                fillPercentage >= 90 ? 'bg-red-500' : fillPercentage >= 70 ? 'bg-orange-500' : 'bg-[#0047AB]'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Organisateur */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
          <img
            src={group.organizer.avatar}
            alt={group.organizer.name}
            className="w-10 h-10 rounded-full ring-2 ring-gray-200"
          />
          <div>
            <p className="text-xs text-gray-500">Organisé par</p>
            <p className="text-sm font-semibold text-gray-800">{group.organizer.name}</p>
          </div>
        </div>

        {/* Bouton voir plus */}
        <div className="flex gap-2">
          <span className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-center bg-[#0047AB] text-white group-hover:bg-[#FFA75F] transition-colors">
            Voir le groupe →
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function GroupesPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Groupes filtrés par recherche uniquement
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchSearch =
        search.trim() === '' ||
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.description.toLowerCase().includes(search.toLowerCase()) ||
        group.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
        group.location.city.toLowerCase().includes(search.toLowerCase()) ||
        group.sport.toLowerCase().includes(search.toLowerCase());

      return matchSearch;
    });
  }, [search]);

  const featuredGroups = groups.filter(g => g.featured);

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
          {/* VUE DÉTAIL D'UN GROUPE */}
          {selectedGroup ? (
            <GroupDetail
              group={selectedGroup}
              onBack={() => setSelectedGroup(null)}
            />
          ) : (
            <>
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-[#0047AB] to-[#FFA75F] px-6 py-8 lg:py-12">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Rejoins un collectif sportif
                  </h1>
                  <p className="text-white/90 text-lg mb-6">
                    Trouve ton groupe, dépasse tes limites ensemble
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 text-white/90 text-sm mb-8">
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      <span className="font-semibold">{groups.length} groupes actifs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} />
                      <span className="font-semibold">
                        {groups.reduce((acc, g) => acc + g.members.current, 0)} athlètes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame size={18} />
                      <span className="font-semibold">Nouvelle communauté chaque jour</span>
                    </div>
                  </div>

                  {/* Recherche */}
                  <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher un groupe, un sport, une ville..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/30 bg-white text-gray-800 text-base focus:outline-none focus:border-white shadow-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
                {/* Groupes en vedette */}
                {search.trim() === '' && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Star size={20} className="text-[#FFA75F]" />
                      <h2 className="font-bold text-[#0047AB] text-xl">Groupes en vedette</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredGroups.map((group) => (
                        <GroupCard key={group.id} group={group} onClick={() => setSelectedGroup(group)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tous les groupes */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Globe size={20} className="text-[#0047AB]" />
                      <h2 className="font-bold text-[#0047AB] text-xl">
                        {search.trim() !== '' ? `Résultats (${filteredGroups.length})` : 'Tous les groupes'}
                      </h2>
                    </div>
                    <Link
                      href="/groupes/creer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0047AB] text-white text-sm font-semibold hover:bg-[#FFA75F] transition-colors shadow-sm"
                    >
                      <Plus size={16} />
                      Créer un groupe
                    </Link>
                  </div>

                  {filteredGroups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGroups.map((group) => (
                        <GroupCard key={group.id} group={group} onClick={() => setSelectedGroup(group)} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                      <div className="w-20 h-20 bg-[#0047AB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-[#0047AB]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0047AB] mb-2">
                        Aucun groupe trouvé
                      </h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Aucun groupe ne correspond à ta recherche. Essaie d'autres mots-clés ou crée ton propre groupe !
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => setSearch('')}
                          className="px-6 py-2.5 rounded-xl border-2 border-[#0047AB] text-[#0047AB] font-semibold text-sm hover:bg-[#0047AB]/5 transition-colors"
                        >
                          Effacer la recherche
                        </button>
                        <Link
                          href="/groupes/creer"
                          className="px-6 py-2.5 rounded-xl bg-[#0047AB] text-white font-semibold text-sm hover:bg-[#FFA75F] transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Créer un groupe
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-[#0047AB] to-[#FFA75F] rounded-2xl p-8 lg:p-12 text-center mb-8">
                  <Award size={40} className="text-white mx-auto mb-4" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    Tu ne trouves pas ton bonheur ?
                  </h2>
                  <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto">
                    Crée ton propre groupe et fédère une communauté autour de ta passion sportive. C'est gratuit et ça prend 2 minutes !
                  </p>
                  <Link
                    href="/groupes/creer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[#0047AB] font-bold text-base hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <Plus size={20} />
                    Créer mon groupe
                  </Link>
                </div>
              </div>

              <Footer />
            </>
          )}
        </main>
      </div>
    </div>
  );
}