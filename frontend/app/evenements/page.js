'use client';

import { useState, useMemo } from 'react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import Footer from '../components/Footer/Footer';
import { Calendar, MapPin, Users, Clock, ChevronRight, Filter, Search, ArrowLeft, CheckCircle, Heart, Share2, UserPlus, MessageCircle, Globe, Award, Info, Shield, Tag } from 'lucide-react';

// 👥 FAUX PARTICIPANTS
const fakeParticipants = [
  { name: "Julie M.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie", role: "Organisateur", joinedAgo: "Organisatrice" },
  { name: "Lucas P.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", role: "Bénévole", joinedAgo: "Il y a 2 mois" },
  { name: "Sophie B.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", role: "Participant", joinedAgo: "Il y a 6 semaines" },
  { name: "Thomas M.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas", role: "Participant", joinedAgo: "Il y a 1 mois" },
  { name: "Camille R.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille", role: "Participant", joinedAgo: "Il y a 3 semaines" },
  { name: "Alex D.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", role: "Participant", joinedAgo: "Il y a 2 semaines" },
  { name: "Marie L.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie", role: "Participant", joinedAgo: "Il y a 10 jours" },
  { name: "Paul H.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul", role: "Participant", joinedAgo: "Il y a 1 semaine" },
  { name: "Emma V.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", role: "Participant", joinedAgo: "Il y a 4 jours" },
  { name: "Nathan G.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan", role: "Participant", joinedAgo: "Il y a 1 jour" },
  { name: "Clara F.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Clara", role: "Participant", joinedAgo: "Aujourd'hui" },
  { name: "Hugo R.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hugo", role: "Bénévole", joinedAgo: "Il y a 1 mois" },
];

const events = [
  {
    id: 1,
    title: 'Marathon de Paris',
    category: 'Course',
    categoryColor: 'bg-blue-100 text-blue-700',
    date: '6 avril 2025',
    time: '08h00',
    location: 'Paris, Île-de-France',
    exactLocation: 'Départ : Avenue des Champs-Élysées',
    participants: 1240,
    maxParticipants: 2000,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Courez les 42km du mythique parcours parisien à travers les plus beaux monuments de la capitale. Parcours accessible aux débutants avec une formule 10km.',
    longDescription: "Le Marathon de Paris est l'un des plus grands marathons du monde. Traversez la capitale en passant par les Champs-Élysées, la Place de la Concorde, le Louvre, la Bastille et le Bois de Vincennes.\n\nFormules disponibles :\n• Marathon complet (42,195 km)\n• Semi-marathon (21,1 km)\n• Course 10 km pour les débutants\n• Marche nordique 10 km\n\nOrganisation :\n• Dossards à retirer le vendredi ou samedi au Salon du Running\n• Ravitaillements tous les 5 km (eau, fruits, gels)\n• Service médical sur tout le parcours\n• Médaille finisher et t-shirt offerts\n• Village d'arrivée avec massages et restauration\n\nInscription validée = accès au plan d'entraînement personnalisé de 12 semaines.",
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&h=300&fit=crop',
    tags: ['Course à pied', 'Outdoor', 'Chrono'],
    accessible: false,
    organizer: { name: "Fédération Running Paris", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FedRunning" },
    schedule: [
      { time: "06h00", label: "Ouverture du village départ" },
      { time: "07h30", label: "Échauffement collectif" },
      { time: "08h00", label: "Départ Marathon & Semi" },
      { time: "08h30", label: "Départ 10km" },
      { time: "14h00", label: "Fermeture du parcours" },
      { time: "15h00", label: "Remise des prix" },
    ],
    includes: ["Dossard chronométré", "Ravitaillements", "Médaille finisher", "T-shirt officiel", "Accès village arrivée"],
    requirements: ["Certificat médical de moins d'un an", "Avoir 18 ans minimum (16 ans pour le 10km)"],
  },
  {
    id: 2,
    title: "Yoga en plein air — Parc de la Tête d'Or",
    category: 'Bien-être',
    categoryColor: 'bg-purple-100 text-purple-700',
    date: '12 avril 2025',
    time: '09h30',
    location: 'Lyon, Auvergne-Rhône-Alpes',
    exactLocation: 'Pelouse centrale, Parc de la Tête d\'Or',
    participants: 85,
    maxParticipants: 120,
    level: 'Débutant',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Séance de yoga en plein air adaptée à tous. Aucun matériel requis, tapis fournis. Idéal pour démarrer la pratique ou se reconnecter à la nature.',
    longDescription: "Une matinée de yoga accessible à tous dans le cadre magnifique du Parc de la Tête d'Or à Lyon.\n\nProgramme :\n• 9h30 — Accueil et installation sur la pelouse\n• 9h45 — Méditation guidée (15 min)\n• 10h00 — Séance de Hatha Yoga doux (45 min)\n• 10h45 — Relaxation et Shavasana (15 min)\n• 11h00 — Thé et collation partagée\n\nTout est fourni :\n• Tapis de yoga\n• Briques et sangles\n• Couvertures pour la relaxation\n\nLa séance est animée par Marie, professeure certifiée Yoga Alliance avec 8 ans d'expérience. Elle adapte chaque posture à votre niveau.\n\nEn cas de pluie, repli dans la salle polyvalente du parc.",
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=300&fit=crop',
    tags: ['Yoga', 'Outdoor', 'Détente'],
    accessible: true,
    organizer: { name: "Marie Dupont", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie" },
    schedule: [
      { time: "09h30", label: "Accueil et installation" },
      { time: "09h45", label: "Méditation guidée" },
      { time: "10h00", label: "Séance de Hatha Yoga" },
      { time: "10h45", label: "Relaxation" },
      { time: "11h00", label: "Thé et collation" },
    ],
    includes: ["Tapis de yoga", "Accessoires", "Couverture", "Thé et collation"],
    requirements: ["Tenue confortable", "Gourde d'eau"],
  },
  {
    id: 3,
    title: 'Tournoi de Bocce Ball Handibasket',
    category: 'Sport adapté',
    categoryColor: 'bg-orange-100 text-orange-700',
    date: '19 avril 2025',
    time: '10h00',
    location: 'Bordeaux, Nouvelle-Aquitaine',
    exactLocation: 'Gymnase municipal, Quai de Bacalan',
    participants: 48,
    maxParticipants: 80,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Tournoi amical de bocce ball et initiation au basket en fauteuil roulant. Événement inclusif ouvert aux personnes valides et en situation de handicap.',
    longDescription: "Un événement 100% inclusif qui mélange valides et personnes en situation de handicap autour de deux disciplines passionnantes.\n\nAu programme :\n• Matin : Initiation au handibasket (fauteuils fournis)\n• Après-midi : Tournoi de bocce ball en équipes mixtes\n• Toute la journée : stands sensibilisation au handicap\n\nOrganisation :\n• Équipes formées sur place (mixité valides/handicap)\n• Arbitrage par des bénévoles formés\n• Vestiaires et douches accessibles PMR\n• Food truck et buvette sur place\n• Remise de trophées à 17h\n\nL'objectif est de créer du lien et de découvrir le sport autrement. Aucune expérience requise, juste de la bonne humeur !",
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&h=300&fit=crop',
    tags: ['Inclusif', 'Handibasket', 'Tournoi'],
    accessible: true,
    organizer: { name: "Association Handisport Bordeaux", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Handisport" },
    schedule: [
      { time: "09h30", label: "Accueil des participants" },
      { time: "10h00", label: "Initiation handibasket" },
      { time: "12h30", label: "Pause déjeuner" },
      { time: "14h00", label: "Tournoi bocce ball" },
      { time: "17h00", label: "Remise des trophées" },
    ],
    includes: ["Fauteuils roulants sport", "Équipement bocce ball", "Déjeuner inclus", "Trophées"],
    requirements: ["Aucun prérequis", "Tenue de sport"],
  },
  {
    id: 4,
    title: 'Randonnée nordique en forêt',
    category: 'Randonnée',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    date: '26 avril 2025',
    time: '07h45',
    location: 'Strasbourg, Grand Est',
    exactLocation: 'Parking forêt du Neuhof',
    participants: 62,
    maxParticipants: 100,
    level: 'Intermédiaire',
    levelColor: 'bg-yellow-100 text-yellow-700',
    description: 'Randonnée de 15km dans la forêt rhénane avec bâtons de marche nordique. Encadrement professionnel, pique-nique partagé à mi-parcours.',
    longDescription: "Explorez la magnifique forêt rhénane de Strasbourg lors de cette randonnée nordique de 15 km encadrée par des professionnels.\n\nDétails du parcours :\n• Distance : 15 km (boucle)\n• Dénivelé : 150m positif\n• Durée estimée : 4h avec pauses\n• Terrain : sentiers forestiers, chemins de halage\n\nDéroulement :\n• 7h45 — Accueil et briefing technique\n• 8h00 — Départ, initiation technique marche nordique\n• 10h00 — Pause pique-nique au bord du Rhin\n• 12h00 — Retour au parking\n\nÀ prévoir :\n• Chaussures de randonnée\n• Vêtements adaptés à la météo\n• Pique-nique et eau (1,5L minimum)\n• Bâtons de marche nordique (prêt possible sur inscription)",
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=300&fit=crop',
    tags: ['Marche nordique', 'Nature', 'Groupe'],
    accessible: false,
    organizer: { name: "Club Rando Alsace", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RandoAlsace" },
    schedule: [
      { time: "07h45", label: "Accueil et briefing" },
      { time: "08h00", label: "Départ randonnée" },
      { time: "10h00", label: "Pause pique-nique" },
      { time: "12h00", label: "Retour au parking" },
    ],
    includes: ["Encadrement professionnel", "Prêt de bâtons (sur demande)", "Assurance randonnée"],
    requirements: ["Chaussures de randonnée", "Pique-nique et eau 1,5L", "Condition physique correcte"],
  },
  {
    id: 5,
    title: "Initiation au paddle — Lac d'Annecy",
    category: 'Nautique',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    date: '3 mai 2025',
    time: '14h00',
    location: 'Annecy, Haute-Savoie',
    exactLocation: 'Base nautique, Plage des Marquisats',
    participants: 30,
    maxParticipants: 40,
    level: 'Débutant',
    levelColor: 'bg-green-100 text-green-700',
    description: "Découvrez le stand-up paddle sur les eaux turquoise du lac d'Annecy. Équipement fourni, moniteur diplômé. Accessible aux personnes à mobilité réduite sur demande.",
    longDescription: "Venez découvrir le stand-up paddle sur l'un des plus beaux lacs d'Europe !\n\nDéroulement de l'après-midi :\n• 14h00 — Accueil à la base nautique\n• 14h15 — Briefing sécurité et technique de base à terre\n• 14h30 — Mise à l'eau et initiation guidée (1h30)\n• 16h00 — Balade libre sur le lac\n• 16h30 — Retour et rangement du matériel\n• 17h00 — Pot de l'amitié offert\n\nTout est fourni :\n• Planche de paddle et pagaie\n• Gilet de sauvetage\n• Combinaison (si besoin selon la température)\n\nAccessibilité : sur demande préalable, des planches adaptées pour personnes à mobilité réduite sont disponibles.\n\nCondition : savoir nager 25 mètres.",
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=300&fit=crop',
    tags: ['Paddle', 'Eau', 'Découverte'],
    accessible: true,
    organizer: { name: "Annecy Paddle Club", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PaddleClub" },
    schedule: [
      { time: "14h00", label: "Accueil" },
      { time: "14h15", label: "Briefing sécurité" },
      { time: "14h30", label: "Initiation guidée" },
      { time: "16h00", label: "Balade libre" },
      { time: "17h00", label: "Pot de l'amitié" },
    ],
    includes: ["Planche et pagaie", "Gilet de sauvetage", "Combinaison", "Boisson offerte"],
    requirements: ["Savoir nager 25m", "Maillot de bain", "Serviette et crème solaire"],
  },
  {
    id: 6,
    title: 'Crossfit Open Box Challenge',
    category: 'Musculation',
    categoryColor: 'bg-red-100 text-red-700',
    date: '10 mai 2025',
    time: '09h00',
    location: 'Toulouse, Occitanie',
    exactLocation: 'CrossFit Box Toulouse Sud',
    participants: 156,
    maxParticipants: 200,
    level: 'Avancé',
    levelColor: 'bg-red-100 text-red-700',
    description: 'Compétition de CrossFit en équipes de 3. WODs variés sur la journée entière. Catégories par niveau, remise des prix le soir. Food truck sur place.',
    longDescription: "Le plus grand Open Box Challenge du Sud-Ouest revient pour sa 4e édition !\n\nFormat :\n• Équipes de 3 (mixtes ou non)\n• 5 WODs sur la journée\n• 3 catégories : RX, Scaled, Beginners\n• Classement en direct sur écran géant\n\nProgramme :\n• 8h00 — Check-in et échauffement\n• 9h00 — WOD 1 & 2\n• 12h00 — Pause déjeuner (food trucks)\n• 13h30 — WOD 3 & 4\n• 16h00 — WOD 5 (finale)\n• 17h30 — Remise des prix et DJ set\n\nLots : bons d'achat équipement, abonnements box, compléments alimentaires.\n\nInscription par équipe uniquement. 30€/personne.",
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=300&fit=crop',
    tags: ['CrossFit', 'Compétition', 'Équipe'],
    accessible: false,
    organizer: { name: "CrossFit Toulouse", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CrossFitTlse" },
    schedule: [
      { time: "08h00", label: "Check-in et échauffement" },
      { time: "09h00", label: "WOD 1 & 2" },
      { time: "12h00", label: "Pause déjeuner" },
      { time: "13h30", label: "WOD 3 & 4" },
      { time: "16h00", label: "WOD 5 — Finale" },
      { time: "17h30", label: "Remise des prix" },
    ],
    includes: ["5 WODs", "T-shirt compétition", "Accès food trucks", "Lots pour le podium"],
    requirements: ["Équipe de 3 personnes", "Expérience CrossFit requise", "30€/personne"],
  },
  {
    id: 7,
    title: 'Vélo adapté & handcycle — Tour de ville',
    category: 'Sport adapté',
    categoryColor: 'bg-orange-100 text-orange-700',
    date: '17 mai 2025',
    time: '10h30',
    location: 'Nantes, Pays de la Loire',
    exactLocation: 'Parvis de la gare de Nantes',
    participants: 35,
    maxParticipants: 60,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Balade à vélo et handcycle de 20km à travers Nantes. Vélos adaptés disponibles, parcours plat et balisé. Accueil des personnes avec ou sans handicap moteur.',
    longDescription: "Une balade à vélo inclusive à travers les plus beaux quartiers de Nantes !\n\nParcours de 20 km entièrement plat et balisé :\n• Départ gare de Nantes → Île de Nantes → Trentemoult → Bords de l'Erdre → Retour\n\nVélos disponibles :\n• Vélos classiques\n• Handcycles (vélo à bras)\n• Tandems\n• Tricycles adaptés\n• Vélos à assistance électrique\n\nEncadrement :\n• 5 bénévoles formés\n• Véhicule d'assistance\n• Pause ravitaillement à mi-parcours\n\nTous les vélos adaptés sont fournis gratuitement. Réservation obligatoire pour les vélos spéciaux.",
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=300&fit=crop',
    tags: ['Cyclisme', 'Inclusif', 'Balade'],
    accessible: true,
    organizer: { name: "Handisport Nantes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HandiNantes" },
    schedule: [
      { time: "10h00", label: "Accueil et attribution vélos" },
      { time: "10h30", label: "Départ balade" },
      { time: "12h00", label: "Pause ravitaillement" },
      { time: "13h00", label: "Retour au point de départ" },
    ],
    includes: ["Vélo adapté gratuit", "Casque", "Ravitaillement", "Encadrement"],
    requirements: ["Réserver le type de vélo souhaité", "Tenue adaptée à la météo"],
  },
  {
    id: 8,
    title: 'Tournoi de pétanque intergénérationnel',
    category: 'Loisirs',
    categoryColor: 'bg-lime-100 text-lime-700',
    date: '24 mai 2025',
    time: '14h00',
    location: 'Marseille, PACA',
    exactLocation: 'Boulodrome du Vieux-Port',
    participants: 90,
    maxParticipants: 160,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Grand tournoi de pétanque en doublettes mêlant toutes les générations. Ambiance conviviale garantie, buvette et restauration sur place. Aucune expérience requise.',
    longDescription: "Le grand tournoi de pétanque intergénérationnel revient au Vieux-Port de Marseille !\n\nConcept :\n• Doublettes obligatoirement mixtes en âge (un joueur -30 ans + un joueur +50 ans)\n• Poules de 4 équipes puis élimination directe\n• 3 parties minimum garanties\n\nAmbiance :\n• DJ set l'après-midi\n• Buvette et food trucks\n• Jeux pour enfants\n• Remise des prix à 18h\n\nInscription gratuite, boules fournies. Venez en famille ou entre amis, les doublettes seront formées sur place si vous venez seul(e) !\n\nL'événement est accessible aux personnes en fauteuil roulant (terrain adapté).",
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop',
    tags: ['Pétanque', 'Famille', 'Convivial'],
    accessible: true,
    organizer: { name: "Pétanque pour tous", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petanque" },
    schedule: [
      { time: "13h30", label: "Accueil et inscription" },
      { time: "14h00", label: "Début des poules" },
      { time: "16h00", label: "Phases finales" },
      { time: "18h00", label: "Remise des prix" },
    ],
    includes: ["Boules fournies", "3 parties minimum", "Inscription gratuite"],
    requirements: ["Aucun prérequis", "Bonne humeur obligatoire !"],
  },
  {
    id: 9,
    title: "Escalade en salle — Journée découverte",
    category: 'Escalade',
    categoryColor: 'bg-stone-100 text-stone-700',
    date: '31 mai 2025',
    time: '10h00',
    location: 'Grenoble, Isère',
    exactLocation: 'Salle Vertical\'Art Grenoble',
    participants: 40,
    maxParticipants: 50,
    level: 'Débutant',
    levelColor: 'bg-green-100 text-green-700',
    description: "Journée d'initiation à l'escalade en salle. Tout l'équipement est fourni. Les moniteurs s'adaptent à chaque profil. Ouvert aux personnes avec handicap visuel partiel.",
    longDescription: "Découvrez l'escalade en salle lors de cette journée spéciale débutants !\n\nProgramme :\n• 10h00 — Accueil, distribution du matériel\n• 10h30 — Initiation technique (nœuds, assurage, communication)\n• 11h00 — Premières voies en moulinette\n• 12h30 — Pause déjeuner (non fourni)\n• 14h00 — Session bloc (sans corde)\n• 15h30 — Mini-challenge amical\n• 16h30 — Remise des diplômes du grimpeur\n\nÉquipement fourni : chaussons, baudrier, casque.\n\nMoniteurs formés à l'accompagnement de personnes avec handicap visuel. Parcours tactile disponible.\n\nRatio : 1 moniteur pour 5 grimpeurs maximum.",
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=300&fit=crop',
    tags: ['Escalade', 'Indoor', 'Initiation'],
    accessible: true,
    organizer: { name: "Vertical'Art Grenoble", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VerticalArt" },
    schedule: [
      { time: "10h00", label: "Accueil et matériel" },
      { time: "10h30", label: "Initiation technique" },
      { time: "11h00", label: "Premières voies" },
      { time: "14h00", label: "Session bloc" },
      { time: "15h30", label: "Mini-challenge" },
      { time: "16h30", label: "Diplômes du grimpeur" },
    ],
    includes: ["Chaussons d'escalade", "Baudrier", "Casque", "Encadrement moniteur"],
    requirements: ["Tenue de sport", "Prévoir son déjeuner"],
  },
  {
    id: 10,
    title: 'Triathlon Sprint — Lac de Vassivière',
    category: 'Triathlon',
    categoryColor: 'bg-indigo-100 text-indigo-700',
    date: '7 juin 2025',
    time: '07h30',
    location: 'Vassivière, Creuse',
    exactLocation: 'Centre nautique, Île de Vassivière',
    participants: 280,
    maxParticipants: 400,
    level: 'Intermédiaire',
    levelColor: 'bg-yellow-100 text-yellow-700',
    description: '750m natation, 20km vélo, 5km course. Format idéal pour franchir le cap du premier triathlon. Catégories handisport para-triathlon disponibles.',
    longDescription: "Le Triathlon Sprint du Lac de Vassivière, l'événement idéal pour votre premier triathlon !\n\nDistances :\n• Natation : 750m en eau libre (lac)\n• Vélo : 20km (parcours vallonné)\n• Course : 5km (tour du lac)\n\nCatégories :\n• Individuel Homme / Femme\n• Relais par équipe de 3\n• Para-triathlon (catégories PTS2 à PTS5, PTWC)\n\nDéroulement :\n• 6h30 — Ouverture du parc de transition\n• 7h30 — Départ vague 1 (Elite + Para)\n• 8h00 — Départs suivants par vagues\n• 12h00 — Fermeture du parcours\n• 13h00 — Remise des prix et barbecue\n\nTarif : 45€ individuel, 60€ relais. Licence FFTri ou certificat médical obligatoire.",
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=300&fit=crop',
    tags: ['Triathlon', 'Multi-sport', 'Chronométré'],
    accessible: true,
    organizer: { name: "Tri Vassivière", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TriVassiviere" },
    schedule: [
      { time: "06h30", label: "Ouverture parc transition" },
      { time: "07h30", label: "Départ vague 1" },
      { time: "08h00", label: "Départs suivants" },
      { time: "12h00", label: "Fermeture parcours" },
      { time: "13h00", label: "Remise des prix & barbecue" },
    ],
    includes: ["Dossard chronométré", "Bonnet de bain", "Ravitaillements", "Médaille finisher", "Barbecue"],
    requirements: ["Licence FFTri ou certificat médical", "Vélo en bon état + casque", "45€/personne"],
  },
  {
    id: 11,
    title: 'Aquagym & natation adaptée',
    category: 'Aquatique',
    categoryColor: 'bg-sky-100 text-sky-700',
    date: '14 juin 2025',
    time: '11h00',
    location: 'Lille, Hauts-de-France',
    exactLocation: 'Piscine municipale Marx Dormoy',
    participants: 28,
    maxParticipants: 40,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: "Séance d'aquagym et natation adaptée en piscine municipale. Encadrée par un MNS formé au handicap. Accès PMR, vestiaires adaptés.",
    longDescription: "Séance de sport aquatique inclusive, encadrée par un Maître Nageur Sauveteur formé au handicap.\n\nProgramme :\n• 11h00 — Accueil dans l'eau\n• 11h15 — Aquagym douce (30 min)\n• 11h45 — Natation adaptée par niveaux (30 min)\n• 12h15 — Relaxation aquatique\n• 12h30 — Fin de séance\n\nAccessibilité :\n• Accès PMR complet (vestiaires, douches, bassin)\n• Lève-personne disponible\n• Accompagnateurs bienvenus (gratuit)\n• Eau à 29°C\n\nParfait pour les personnes souffrant de douleurs articulaires, de problèmes de dos, ou en rééducation. Aucun niveau de natation requis (zone peu profonde disponible).",
    image: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&h=300&fit=crop',
    tags: ['Aquagym', 'Natation', 'Adapté'],
    accessible: true,
    organizer: { name: "Sport Santé Lille", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SportSante" },
    schedule: [
      { time: "11h00", label: "Accueil" },
      { time: "11h15", label: "Aquagym douce" },
      { time: "11h45", label: "Natation adaptée" },
      { time: "12h15", label: "Relaxation aquatique" },
    ],
    includes: ["Encadrement MNS", "Accès piscine", "Matériel aquagym"],
    requirements: ["Maillot de bain", "Bonnet de bain obligatoire", "Certificat médical recommandé"],
  },
  {
    id: 12,
    title: 'Tournoi de tennis de table',
    category: 'Raquette',
    categoryColor: 'bg-pink-100 text-pink-700',
    date: '21 juin 2025',
    time: '13h00',
    location: 'Rennes, Bretagne',
    exactLocation: 'Halle des sports Bréquigny',
    participants: 64,
    maxParticipants: 128,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Tournoi de ping-pong en poules puis en direct. Tableau valide et tableau parathlète. Bonne humeur obligatoire !',
    longDescription: "Le plus grand tournoi de tennis de table de Bretagne, ouvert à tous !\n\nFormat :\n• Poules de 4 joueurs puis tableau à élimination directe\n• 2 tableaux : valide et parathlète\n• Catégories : -16 ans, Open, +50 ans\n• 3 matchs minimum garantis\n\nInfrastructure :\n• 16 tables de compétition\n• Arbitrage officiel\n• Tables accessibles fauteuil roulant\n• Tribunes spectateurs\n\nAnimation : DJ, buvette, stands partenaires.\n\nInscription : 5€, raquettes fournies si besoin.\n\nLe tournoi est qualificatif pour les championnats régionaux.",
    image: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=600&h=300&fit=crop',
    tags: ['Ping-pong', 'Tournoi', 'Inclusif'],
    accessible: true,
    organizer: { name: "TT Rennes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TTRennes" },
    schedule: [
      { time: "12h30", label: "Accueil et tirage au sort" },
      { time: "13h00", label: "Début des poules" },
      { time: "15h00", label: "Tableaux finaux" },
      { time: "17h00", label: "Finales" },
      { time: "17h30", label: "Remise des prix" },
    ],
    includes: ["Raquette (si besoin)", "3 matchs minimum", "5€ d'inscription"],
    requirements: ["Tenue de sport", "Chaussures de salle"],
  },
  {
    id: 13,
    title: 'Trail nocturne des Causses',
    category: 'Trail',
    categoryColor: 'bg-violet-100 text-violet-700',
    date: '28 juin 2025',
    time: '21h00',
    location: 'Millau, Aveyron',
    exactLocation: 'Place du Mandarous, Millau',
    participants: 310,
    maxParticipants: 500,
    level: 'Avancé',
    levelColor: 'bg-red-100 text-red-700',
    description: 'Trail nocturne de 25km sur les sentiers des Grands Causses. Lampe frontale obligatoire. Expérience trail recommandée.',
    longDescription: "Le Trail Nocturne des Causses : une expérience unique sous les étoiles !\n\nParcours de 25km :\n• Départ de Millau centre\n• Montée sur le Causse du Larzac\n• Passage au pied du Viaduc de Millau illuminé\n• Sentiers techniques en crête\n• Descente dans la vallée du Tarn\n• Arrivée à Millau\n\nProfil : 800m D+ / 800m D-\nTemps de course : 2h30 à 5h selon niveau\n\nRavitaillements : tous les 8km (eau, coca, fruits secs, fromage local)\nBalise : parcours entièrement fléché et balisé lumineux\n\nInscription : 35€, dossard chronométré, t-shirt finisher.\nPas de retrait le jour J : dossards à récupérer le samedi après-midi.",
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=300&fit=crop',
    tags: ['Trail', 'Nuit', 'Nature'],
    accessible: false,
    organizer: { name: "Trail Causses Aveyron", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TrailCausses" },
    schedule: [
      { time: "17h00", label: "Retrait des dossards" },
      { time: "20h00", label: "Briefing course" },
      { time: "21h00", label: "Départ" },
      { time: "02h00", label: "Fermeture barrière horaire" },
    ],
    includes: ["Dossard chronométré", "T-shirt finisher", "Ravitaillements", "Assurance"],
    requirements: ["Lampe frontale obligatoire", "Téléphone chargé", "Réserve d'eau 500ml min", "Expérience trail"],
  },
  {
    id: 14,
    title: "Initiation au tir à l'arc — Toutes capacités",
    category: 'Précision',
    categoryColor: 'bg-teal-100 text-teal-700',
    date: '5 juillet 2025',
    time: '10h00',
    location: 'Dijon, Bourgogne',
    exactLocation: 'Club de tir à l\'arc de Dijon, Parc de la Combe à la Serpent',
    participants: 22,
    maxParticipants: 30,
    level: 'Débutant',
    levelColor: 'bg-green-100 text-green-700',
    description: "Journée d'initiation au tir à l'arc en club agréé. Discipline praticable debout, assise ou en fauteuil. Matériel adapté disponible.",
    longDescription: "Le tir à l'arc est l'un des sports les plus accessibles qui existent. Venez le découvrir !\n\nProgramme :\n• 10h00 — Accueil et présentation de la discipline\n• 10h30 — Apprentissage posture, visée, lâcher\n• 11h30 — Tir en situation (cibles à 10m et 18m)\n• 12h30 — Pause déjeuner (non fourni)\n• 14h00 — Mini-concours amical\n• 15h30 — Remise des diplômes\n\nAccessibilité totale :\n• Tir debout, assis sur chaise, ou en fauteuil roulant\n• Arcs adaptés (légèreté, aide au maintien)\n• Moniteurs formés au handicap\n• Aucune force physique particulière requise\n\nMatériel entièrement fourni. Gratuit.",
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=300&fit=crop',
    tags: ["Tir à l'arc", 'Précision', 'Adapté'],
    accessible: true,
    organizer: { name: "Archers de Dijon", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArchersDijon" },
    schedule: [
      { time: "10h00", label: "Accueil" },
      { time: "10h30", label: "Apprentissage technique" },
      { time: "11h30", label: "Tir en situation" },
      { time: "14h00", label: "Mini-concours" },
      { time: "15h30", label: "Diplômes" },
    ],
    includes: ["Arc et flèches", "Protections", "Encadrement", "Gratuit"],
    requirements: ["Aucun prérequis physique", "Chaussures fermées"],
  },
  {
    id: 15,
    title: 'Surf pour tous — Les Landes',
    category: 'Nautique',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    date: '12 juillet 2025',
    time: '09h00',
    location: 'Hossegor, Landes',
    exactLocation: 'Plage de La Gravière, Hossegor',
    participants: 50,
    maxParticipants: 60,
    level: 'Débutant',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Initiation au surf encadrée. Formule inclusive avec planche adaptée pour personnes à mobilité réduite (surf assis). Matériel et combinaisons fournis.',
    longDescription: "Surf pour tous à Hossegor : l'océan n'a pas de limites !\n\nDéroulement :\n• 9h00 — Accueil sur la plage\n• 9h15 — Échauffement et technique à terre\n• 9h45 — Session surf 1 (1h30)\n• 11h15 — Pause et collation\n• 11h45 — Session surf 2 (1h)\n• 13h00 — Fin de journée, photo de groupe\n\nFormules adaptées :\n• Surf classique (debout)\n• Surf assis (tandem avec moniteur)\n• Bodyboard adapté\n\nTout est fourni : planche, combinaison, lycra.\n\nConditions : les sessions sont annulées si les vagues dépassent 1m50 (sécurité). Report au lendemain dans ce cas.\n\nTarif : 15€/personne, gratuit pour les accompagnateurs.",
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=300&fit=crop',
    tags: ['Surf', 'Mer', 'Inclusif'],
    accessible: true,
    organizer: { name: "Surf Inclusion Landes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SurfInclusion" },
    schedule: [
      { time: "09h00", label: "Accueil sur la plage" },
      { time: "09h15", label: "Échauffement" },
      { time: "09h45", label: "Session surf 1" },
      { time: "11h15", label: "Pause collation" },
      { time: "11h45", label: "Session surf 2" },
      { time: "13h00", label: "Photo de groupe" },
    ],
    includes: ["Planche de surf", "Combinaison", "Lycra", "Collation", "15€/personne"],
    requirements: ["Savoir nager", "Maillot de bain", "Serviette"],
  },
  {
    id: 16,
    title: "Course d'orientation en forêt",
    category: 'Orientation',
    categoryColor: 'bg-amber-100 text-amber-700',
    date: '19 juillet 2025',
    time: '08h30',
    location: 'Fontainebleau, Seine-et-Marne',
    exactLocation: 'Parking de la Croix du Grand Maître',
    participants: 75,
    maxParticipants: 150,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: "Course d'orientation en forêt de Fontainebleau. Parcours courts (famille), moyens (sportifs) et longs (compétiteurs). Idéal pour développer sens de l'observation et endurance.",
    longDescription: "La forêt de Fontainebleau, terrain de jeu idéal pour la course d'orientation !\n\nTrois circuits disponibles :\n• Court (2-3km) : idéal pour les familles et les débutants\n• Moyen (6-8km) : pour les sportifs curieux\n• Long (12-15km) : pour les compétiteurs expérimentés\n\nMatériel fourni :\n• Carte détaillée 1:10 000\n• Boussole et dossard\n• Poinçon électronique\n\nRésultats en direct sur écran au point d'arrivée. Goûter offert à l'arrivée pour tous.",
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop',
    tags: ['Orientation', 'Forêt', 'Famille'],
    accessible: false,
    organizer: { name: "Club CO Fontainebleau", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=COFontainebleau" },
    schedule: [
      { time: "08h30", label: "Accueil et distribution des cartes" },
      { time: "09h00", label: "Départ échelonné" },
      { time: "12h00", label: "Clôture des départs" },
      { time: "14h00", label: "Remise des prix" },
    ],
    includes: ["Carte et boussole", "Poinçon électronique", "Goûter à l'arrivée"],
    requirements: ["Chaussures de trail ou de rando", "Téléphone chargé", "Tenue adaptée à la forêt"],
  },
  {
    id: 17,
    title: 'Boccia — Championnat régional',
    category: 'Sport adapté',
    categoryColor: 'bg-orange-100 text-orange-700',
    date: '26 juillet 2025',
    time: '10h00',
    location: 'Montpellier, Hérault',
    exactLocation: 'Gymnase Georges Frêche, route de Palavas',
    participants: 42,
    maxParticipants: 64,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: 'Championnat régional de boccia, sport paralympique officiel. Accessible aux personnes souffrant de paralysie cérébrale ou de handicap moteur sévère. Ouvert aux spectateurs valides.',
    longDescription: "Championnat régional de boccia à Montpellier !\n\nFormat :\n• Catégories BC1, BC2, BC3 (avec aide technique), BC4\n• Phases de poules puis tableau à élimination directe\n• Arbitrage officiel FFH\n\nAccessibilité totale :\n• Gymnase entièrement accessible PMR\n• Vestiaires adaptés\n• Interprète LSF disponible\n\nSpectateurs bienvenus ! Entrée gratuite.",
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=600&h=300&fit=crop',
    tags: ['Boccia', 'Paralympique', 'Compétition'],
    accessible: true,
    organizer: { name: "FFH Occitanie", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FFHOccitanie" },
    schedule: [
      { time: "09h30", label: "Accueil des délégations" },
      { time: "10h00", label: "Phases de poules" },
      { time: "12h30", label: "Pause déjeuner" },
      { time: "14h00", label: "Quarts de finale" },
      { time: "16h00", label: "Demi-finales et finales" },
      { time: "17h30", label: "Remise des médailles" },
    ],
    includes: ["Matériel de compétition", "Arbitrage officiel", "Médailles podium"],
    requirements: ["Licence FFH obligatoire", "Certificat médical de moins d'un an"],
  },
  {
    id: 18,
    title: 'Randonnée en raquettes — Vosges',
    category: 'Montagne',
    categoryColor: 'bg-blue-100 text-blue-700',
    date: '18 janvier 2026',
    time: '08h00',
    location: 'Gérardmer, Vosges',
    exactLocation: 'Office de tourisme de Gérardmer, place des Déportés',
    participants: 38,
    maxParticipants: 50,
    level: 'Intermédiaire',
    levelColor: 'bg-yellow-100 text-yellow-700',
    description: 'Randonnée en raquettes à neige sur les hauts sommets des Vosges. Circuit de 10km, dénivelé modéré. Guide montagne certifié. Raquettes disponibles à la location sur place.',
    longDescription: "Découvrez les Hautes Chaumes des Vosges sous la neige !\n\nParcours de 10km :\n• Départ de Gérardmer (660m)\n• Montée au Hohneck (1364m)\n• Traversée des chaumes\n• Descente par la forêt de sapins\n\nDénivelé : 500m D+/D- • Durée : 4h30 avec pauses\n\nEncadrement :\n• Guide de montagne diplômé\n• Petit groupe (max 12 personnes)\n\nLocation de raquettes possible sur place (10€).",
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=300&fit=crop',
    tags: ['Raquettes', 'Neige', 'Montagne'],
    accessible: false,
    organizer: { name: "Rando Vosges Passion", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RandoVosges" },
    schedule: [
      { time: "08h00", label: "Briefing et équipement" },
      { time: "08h30", label: "Départ de la randonnée" },
      { time: "11h00", label: "Pause pique-nique au sommet" },
      { time: "13h00", label: "Retour à Gérardmer" },
    ],
    includes: ["Encadrement guide diplômé", "Matériel de sécurité", "Raquettes (en option 10€)"],
    requirements: ["Chaussures hautes imperméables", "Tenue chaude et imperméable", "Condition physique correcte"],
  },
  {
    id: 19,
    title: 'Volley-ball assis — Tournoi amical',
    category: 'Sport adapté',
    categoryColor: 'bg-orange-100 text-orange-700',
    date: '8 février 2026',
    time: '13h30',
    location: 'Clermont-Ferrand, Puy-de-Dôme',
    exactLocation: 'Salle polyvalente Croix-de-Neyrat',
    participants: 56,
    maxParticipants: 80,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: "Tournoi amical de volley-ball assis. Valides et personnes en situation de handicap jouent ensemble. Initiation, puis tournoi. Convivialité et fairplay avant tout.",
    longDescription: "Le volley-ball assis : un sport où valides et personnes handicapées se retrouvent sur un pied d'égalité !\n\nFormat de la journée :\n• 13h30 — Initiation pour tous\n• 15h00 — Constitution des équipes mixtes\n• 15h30 — Tournoi amical en poules\n• 17h30 — Finales et remise des récompenses\n\nTous les joueurs jouent assis (sol ou fauteuil). Gratuit, tout le matériel est fourni. Venez en famille !",
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=300&fit=crop',
    tags: ['Volley', 'Assis', 'Inclusif'],
    accessible: true,
    organizer: { name: "Handisport Auvergne", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HandisportAuvergne" },
    schedule: [
      { time: "13h30", label: "Initiation pour tous" },
      { time: "15h00", label: "Constitution des équipes" },
      { time: "15h30", label: "Tournoi amical" },
      { time: "17h30", label: "Finales et remise des prix" },
    ],
    includes: ["Initiation gratuite", "Matériel fourni", "Buvette", "Lots pour les équipes"],
    requirements: ["Aucun prérequis physique", "Tenue de sport", "Bonne humeur obligatoire !"],
  },
  {
    id: 20,
    title: 'Défi SANSLimites — Journée multisports',
    category: 'Multisports',
    categoryColor: 'bg-gradient-to-r from-blue-100 to-orange-100 text-[#0047AB]',
    date: '14 mars 2026',
    time: '09h00',
    location: 'Paris, Île-de-France',
    exactLocation: 'Parc des Princes & alentours',
    participants: 520,
    maxParticipants: 1000,
    level: 'Tous niveaux',
    levelColor: 'bg-green-100 text-green-700',
    description: "L'événement phare de SANSLimites ! Une journée entière avec 12 ateliers sportifs. Valides, seniors, juniors, personnes handicapées : tous bienvenus.",
    longDescription: "Le Défi SANSLimites : l'événement sportif inclusif de l'année !\n\n12 ateliers sportifs pour tous :\n• Trail urbain 5km\n• Yoga & méditation\n• Escalade (mur mobile)\n• Natation en eau libre\n• Boccia paralympique\n• Tir à l'arc adapté\n• CrossFit découverte\n• Danse inclusive\n• Handibasket\n• Parcours obstacles\n• Tennis de table\n• Vélo & handcycle\n\nChaque atelier dure 45 min. Inscrivez-vous à autant d'ateliers que vous le souhaitez !\n\nVillage SANSLimites :\n• Stands partenaires et associations\n• Conférences sport & handicap\n• Food court (10 food trucks)\n• Espace enfants\n• DJ set et concert le soir\n\nEntrée gratuite. Inscription obligatoire pour les ateliers.\n\n100% accessible PMR. Interprète LSF disponible.",
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=300&fit=crop',
    tags: ['Multisports', 'Inclusif', 'SANSLimites'],
    accessible: true,
    featured: true,
    organizer: { name: "SANSLimites", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SANSLimites" },
    schedule: [
      { time: "08h30", label: "Ouverture du village" },
      { time: "09h00", label: "Début des ateliers" },
      { time: "12h30", label: "Pause déjeuner" },
      { time: "14h00", label: "Reprise des ateliers" },
      { time: "17h00", label: "Conférences" },
      { time: "19h00", label: "Concert & DJ set" },
    ],
    includes: ["Entrée gratuite", "Ateliers illimités", "Village SANSLimites", "Concert"],
    requirements: ["Inscription obligatoire aux ateliers", "Tenue de sport"],
  },
];

const allCategories = ['Tous', ...Array.from(new Set(events.map((e) => e.category)))];

// ============================================================
// BARRE DE PROGRESSION
// ============================================================
function ProgressBar({ value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div
        className="h-1.5 rounded-full bg-gradient-to-r from-[#0047AB] to-[#FFA75F] transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ============================================================
// VUE DÉTAIL D'UN ÉVÉNEMENT
// ============================================================
function EventDetail({ event, onBack }) {
  const [registered, setRegistered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  const spotsLeft = event.maxParticipants - event.participants;
  const isFull = spotsLeft <= 0;
  const fillPct = (event.participants / event.maxParticipants) * 100;
  const displayedParticipants = showAllParticipants ? fakeParticipants : fakeParticipants.slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      {/* Bouton Retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#0047AB] font-semibold mb-6 hover:text-[#FFA75F] transition-colors group/back"
      >
        <ArrowLeft size={20} className="group-hover/back:-translate-x-1 transition-transform" />
        Retour aux événements
      </button>

      {/* Cover */}
      <div className="relative h-56 lg:h-72 rounded-2xl overflow-hidden mb-6">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${event.categoryColor} backdrop-blur-sm`}>
              {event.category}
            </span>
            {event.accessible && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#0047AB]">
                ♿ Accessible
              </span>
            )}
            {event.featured && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFA75F] text-white">
                ⭐ Événement phare
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{event.title}</h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => { if (!isFull) setRegistered(!registered); }}
          disabled={isFull && !registered}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            registered
              ? 'bg-green-500 text-white'
              : isFull
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : event.featured
                  ? 'bg-gradient-to-r from-[#0047AB] to-[#FFA75F] text-white hover:opacity-90 shadow-lg'
                  : 'bg-[#0047AB] text-white hover:bg-[#FFA75F] shadow-lg hover:shadow-xl'
          }`}
        >
          {registered ? <CheckCircle size={18} /> : <UserPlus size={18} />}
          {registered ? 'Inscrit !' : isFull ? 'Complet' : "S'inscrire"}
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
                  <Calendar size={18} className="text-[#0047AB]" />
                </div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-bold text-gray-800">{event.date}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#FFA75F]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock size={18} className="text-[#FFA75F]" />
                </div>
                <p className="text-xs text-gray-500">Heure</p>
                <p className="text-sm font-bold text-gray-800">{event.time}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#0047AB]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MapPin size={18} className="text-[#0047AB]" />
                </div>
                <p className="text-xs text-gray-500">Lieu</p>
                <p className="text-sm font-bold text-gray-800">{event.location.split(',')[0]}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#FFA75F]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award size={18} className="text-[#FFA75F]" />
                </div>
                <p className="text-xs text-gray-500">Niveau</p>
                <p className="text-sm font-bold text-gray-800">{event.level}</p>
              </div>
            </div>
          </div>

          {/* Lieu exact */}
          {event.exactLocation && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0047AB] text-lg mb-2 flex items-center gap-2">
                <MapPin size={18} /> Lieu de rendez-vous
              </h2>
              <p className="text-sm text-gray-700">{event.exactLocation}</p>
              <p className="text-xs text-gray-500 mt-1">{event.location}</p>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-4">À propos de l'événement</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {event.longDescription || event.description}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {event.tags.map((tag, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Programme */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0047AB] text-lg mb-4">Programme de la journée</h2>
              <div className="space-y-3">
                {event.schedule.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-[#0047AB]/5 hover:bg-[#0047AB]/10 transition-colors">
                    <div className="w-16 shrink-0">
                      <span className="text-sm font-bold text-[#0047AB]">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ce qui est inclus */}
          {event.includes && event.includes.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0047AB] text-lg mb-4 flex items-center gap-2">
                <CheckCircle size={18} /> Ce qui est inclus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {event.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={12} className="text-green-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prérequis */}
          {event.requirements && event.requirements.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#0047AB] text-lg mb-4 flex items-center gap-2">
                <Info size={18} /> Prérequis & matériel
              </h2>
              <div className="space-y-2">
                {event.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FFA75F]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#FFA75F]">{i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{req}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organisateur */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-4">Organisateur</h2>
            <div className="flex items-center gap-3">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-14 h-14 rounded-full ring-2 ring-[#0047AB]/20"
              />
              <div>
                <p className="font-bold text-gray-800">{event.organizer.name}</p>
                <p className="text-xs text-[#FFA75F] font-semibold">Organisateur</p>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl border-2 border-[#0047AB] text-[#0047AB] font-semibold text-sm hover:bg-[#0047AB]/5 transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              Contacter
            </button>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0047AB] text-lg">Participants</h2>
              <span className="text-sm font-semibold text-gray-500">
                {event.participants}/{event.maxParticipants}
              </span>
            </div>

            <ProgressBar value={event.participants} max={event.maxParticipants} />

            {spotsLeft > 0 && spotsLeft <= 20 && (
              <p className="text-xs font-semibold text-orange-500 mt-2">Plus que {spotsLeft} place{spotsLeft > 1 ? 's' : ''} !</p>
            )}
            {isFull && (
              <p className="text-xs font-semibold text-red-500 mt-2">Complet</p>
            )}

            <div className="space-y-3 mt-4">
              {displayedParticipants.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full ring-1 ring-gray-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.joinedAgo}</p>
                  </div>
                  {p.role !== 'Participant' && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0047AB]/10 text-[#0047AB] shrink-0">
                      {p.role === 'Organisateur' ? '👑 Orga' : '🤝 Bénévole'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {fakeParticipants.length > 6 && (
              <button
                onClick={() => setShowAllParticipants(!showAllParticipants)}
                className="w-full mt-4 text-sm font-semibold text-[#0047AB] hover:text-[#FFA75F] transition-colors"
              >
                {showAllParticipants ? 'Voir moins' : `Voir tous (${fakeParticipants.length})`}
              </button>
            )}
          </div>

          {/* Infos pratiques */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-[#0047AB] text-lg mb-3">Infos pratiques</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Catégorie</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${event.categoryColor}`}>{event.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Niveau</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${event.levelColor}`}>{event.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Accessibilité</span>
                <span className="text-sm font-semibold text-gray-700">
                  {event.accessible ? '♿ Accessible' : 'Non adapté'}
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
// CARD ÉVÉNEMENT (cliquable)
// ============================================================
function EventCard({ event, onClick }) {
  const spotsLeft = event.maxParticipants - event.participants;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 20;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col cursor-pointer
      ${event.featured ? 'border-[#FFA75F]' : 'border-gray-100 hover:border-[#0047AB]/30'}`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${event.categoryColor} backdrop-blur-sm`}>
            {event.category}
          </span>
          {event.accessible && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#0047AB]">
              ♿ Accessible
            </span>
          )}
        </div>

        {event.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFA75F] text-white shadow">
              ⭐ Événement phare
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center">
          <p className="text-xs font-bold text-[#0047AB] leading-tight">{event.date}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Clock size={10} />{event.time}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#0047AB] text-base leading-snug mb-1 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
          <MapPin size={12} className="shrink-0 text-[#FFA75F]" />
          <span className="truncate">{event.location}</span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3 flex-1">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {event.tags.map((tag) => (
            <span key={tag} className="text-xs bg-[#0047AB]/8 text-[#0047AB] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Niveau */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${event.levelColor}`}>
            {event.level}
          </span>
          {isFull ? (
            <span className="text-xs font-semibold text-red-500">Complet</span>
          ) : isAlmostFull ? (
            <span className="text-xs font-semibold text-orange-500">Plus que {spotsLeft} place{spotsLeft > 1 ? 's' : ''} !</span>
          ) : null}
        </div>

        {/* Participants */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1">
              <Users size={11} />{event.participants.toLocaleString()} participants
            </span>
            <span>{event.maxParticipants.toLocaleString()} max</span>
          </div>
          <ProgressBar value={event.participants} max={event.maxParticipants} />
        </div>

        {/* Bouton */}
        <span
          className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
            ${event.featured
              ? 'bg-gradient-to-r from-[#0047AB] to-[#FFA75F] text-white'
              : 'bg-[#0047AB] text-white'
            }`}
        >
          Voir l'événement <ChevronRight size={16} />
        </span>
      </div>
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================
export default function EvenementsPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchCat = activeCategory === 'Tous' || e.category === activeCategory;
      const matchAccess = !accessibleOnly || e.accessible;
      const matchSearch =
        search.trim() === '' ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchAccess && matchSearch;
    });
  }, [activeCategory, accessibleOnly, search]);

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
          {/* VUE DÉTAIL */}
          {selectedEvent ? (
            <EventDetail
              event={selectedEvent}
              onBack={() => setSelectedEvent(null)}
            />
          ) : (
            <>
              {/* Hero */}
              <div className="bg-gradient-to-r from-[#0047AB] to-[#FFA75F] px-6 py-8 lg:py-10">
                <div className="max-w-5xl mx-auto">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    <Calendar size={30} />
                    Événements sportifs
                  </h1>
                  <p className="text-white/80 text-sm lg:text-base">
                    {events.length} événements pour tous les niveaux — sportifs, débutants, personnes en situation de handicap
                  </p>
                </div>
              </div>

              <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6">
                {/* Filtres */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
                  <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un événement, une ville, un tag..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0047AB] transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Filter size={14} className="text-gray-400 shrink-0" />
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                          ${activeCategory === cat
                            ? 'bg-[#0047AB] text-white shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-[#0047AB]/10 hover:text-[#0047AB]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                    <div
                      onClick={() => setAccessibleOnly(!accessibleOnly)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${accessibleOnly ? 'bg-[#0047AB]' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow ${accessibleOnly ? 'left-5' : 'left-0.5'}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Afficher uniquement les événements accessibles ♿</span>
                  </label>
                </div>

                {/* Compteur */}
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-bold text-[#0047AB]">{filtered.length}</span> événement{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                </p>

                {/* Grille */}
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Calendar size={52} className="mb-3 opacity-30" />
                    <p className="font-semibold text-base">Aucun événement trouvé</p>
                    <p className="text-sm">Essayez de modifier vos filtres</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filtered.map((event) => (
                      <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Footer />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}