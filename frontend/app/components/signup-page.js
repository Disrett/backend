'use client';

import { useState, useMemo } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Calendar, Users, Target, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '../lib/api';
import { saveTokens, saveUser } from '../lib/auth';

/**
 * Génère un username valide pour le backend à partir du nom ou de l'email.
 * Contraintes backend : 3 à 30 caractères, uniquement [a-zA-Z0-9._-].
 */
function buildUsername(fullName, email) {
  const base = (fullName || (email ? email.split('@')[0] : '') || 'athlete')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/\s+/g, '.') // espaces → points
    .replace(/[^a-z0-9._-]/g, ''); // retire le reste
  let username = base.slice(0, 24) || 'athlete';
  if (username.length < 3) username = `${username}sl`;
  // Suffixe court pour limiter les collisions de noms d'utilisateur.
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${username}.${suffix}`.slice(0, 30);
}

// Liste des sports organisée par catégories
const sportsCategories = {
  "Sports d'équipe 🤝": ["Football", "Basketball", "Volleyball", "Handball", "Rugby", "Hockey sur glace", "Baseball", "Water-polo"],
  "Sports de raquette 🎾": ["Tennis", "Badminton", "Tennis de table (Ping-pong)", "Squash", "Padel"],
  "Sports de combat 🥊": ["Boxe", "MMA / Arts martiaux mixtes", "Judo", "Karaté", "Taekwondo", "Kickboxing", "Jiu-jitsu brésilien", "Lutte"],
  "Sports aquatiques 🏊": ["Natation", "Surf", "Plongée", "Voile", "Kayak", "Stand-up paddle (SUP)", "Aquagym"],
  "Fitness & Musculation 💪": ["Musculation", "CrossFit", "Bodybuilding", "Street workout / Calisthenics", "Circuit training", "HIIT (High Intensity Interval Training)"],
  "Sports d'endurance 🏃": ["Course à pied / Running", "Trail", "Marathon", "Triathlon", "Cyclisme", "VTT (Vélo tout-terrain)", "Marche nordique"],
  "Sports de glisse ⛷️": ["Ski alpin", "Ski de fond", "Snowboard", "Skateboard", "Roller", "Longboard"],
  "Bien-être & Souplesse 🧘": ["Yoga", "Pilates", "Stretching", "Tai-chi", "Méditation active"],
  "Sports extrêmes 🪂": ["Escalade / Grimpe", "Parkour / Freerunning", "Parachutisme", "BMX", "Kitesurf"],
  "Autres sports 🎯": ["Golf", "Équitation", "Danse (Hip-hop, Classique, Contemporaine)", "Gymnastique", "Athlétisme", "Randonnée", "Aviron"]
};

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    sportLevel: '',
    sportGoal: '',
    favoriteSports: [], // Modifié pour être un tableau
    otherSport: '' // Ajout du champ pour le sport personnalisé
  });

  // Génère les particules une seule fois
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2
    }))
  , []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation côté client alignée sur les règles du backend (RegisterDto).
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      // Le backend (RegisterDto) n'accepte QUE { email, password, username, name }.
      // On mappe le formulaire riche vers ce contrat minimal.
      // NB : les champs âge / sexe / niveau / sports préférés ne sont pas encore
      // persistés (voir INTEGRATION.md → limitations connues).
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.fullName.trim(),
        username: buildUsername(formData.fullName, formData.email),
      };
      const tokens = await api.register(payload);
      saveTokens(tokens);
      saveUser({ email: payload.email, name: payload.name, username: payload.username });
      router.push('/');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Une erreur est survenue. Réessayez.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Gestion spécifique pour les cases à cocher des sports
  const handleSportToggle = (sport) => {
    setFormData((prev) => {
      const isSelected = prev.favoriteSports.includes(sport);
      if (isSelected) {
        return {
          ...prev,
          favoriteSports: prev.favoriteSports.filter(s => s !== sport)
        };
      } else {
        return {
          ...prev,
          favoriteSports: [...prev.favoriteSports, sport]
        };
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background avec l'image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/background.png)'
        }}
      >
        {/* Effet de particules/étoiles supplémentaires */}
        <div className="absolute inset-0 opacity-20">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-white rounded-full"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animation: `twinkle ${particle.duration}s infinite`
              }}
            />
          ))}
        </div>
        
        {/* Lignes diagonales décoratives */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-96 h-0.5 bg-gradient-to-r from-orange-300/20 to-transparent transform -rotate-45 origin-left" />
          <div className="absolute top-1/3 left-0 w-80 h-0.5 bg-gradient-to-r from-orange-300/15 to-transparent transform -rotate-45 origin-left translate-y-8" />
          <div className="absolute top-1/2 right-0 w-96 h-0.5 bg-gradient-to-l from-blue-300/20 to-transparent transform rotate-45 origin-right" />
          <div className="absolute bottom-1/4 right-0 w-80 h-0.5 bg-gradient-to-l from-blue-300/15 to-transparent transform rotate-45 origin-right -translate-y-8" />
        </div>
      </div>

      {/* Carte principale */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md my-8">
        <h1 className="text-4xl font-light text-center mb-4 text-gray-800 tracking-wide">
          INSCRIPTION
        </h1>

        {/* Logo Sans Limite */}
        <div className="flex justify-center mb-4">
          <img 
            src="/sans_limite_logo.png" 
            alt="Sans Limite" 
            className="w-20 h-20 object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message d'erreur renvoyé par le backend */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
              {error}
            </div>
          )}

          {/* Champ Nom complet */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="fullName"
              placeholder="Nom complet"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Champ Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Champ Mot de passe */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Champ Âge */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              name="age"
              placeholder="Âge"
              value={formData.age}
              onChange={handleChange}
              min="13"
              max="120"
              className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Champ Sexe */}
          <div className="relative">
            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 appearance-none cursor-pointer"
            >
              <option value="" disabled>Sexe</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
              <option value="non-specifie">Préfère ne pas dire</option>
            </select>
          </div>

          {/* Champ Niveau de sport */}
          <div className="relative">
            <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="sportLevel"
              value={formData.sportLevel}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 appearance-none cursor-pointer"
            >
              <option value="" disabled>Niveau sportif</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Champ Objectif sportif */}
          <div className="relative">
            <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="sportGoal"
              value={formData.sportGoal}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 appearance-none cursor-pointer"
            >
              <option value="" disabled>Objectif sportif</option>
              <option value="perdre-poids">Perdre du poids</option>
              <option value="prendre-muscle">Prendre du muscle</option>
              <option value="endurance">Améliorer l'endurance</option>
              <option value="force">Gagner en force</option>
              <option value="souplesse">Améliorer la souplesse</option>
              <option value="sante">Rester en bonne santé</option>
              <option value="competition">Compétition</option>
              <option value="loisir">Loisir/Plaisir</option>
            </select>
          </div>

          {/* SÉLECTEUR DE SPORTS (Nouveau) */}
          <div className="relative pt-2">
            <div className="flex items-center gap-2 mb-3 px-1 text-gray-600">
              <Heart className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Sports préférés</span>
            </div>
            
            {/* Conteneur scrollable pour les sports */}
            <div className="max-h-60 overflow-y-auto bg-gray-50/50 rounded-xl p-4 border border-gray-100 shadow-inner">
              {Object.entries(sportsCategories).map(([category, sports]) => (
                <div key={category} className="mb-5 last:mb-0">
                  <h3 className="font-semibold text-sm text-orange-500 mb-2 uppercase tracking-wider">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sports.map(sport => (
                      <label key={sport} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.favoriteSports.includes(sport)}
                          onChange={() => handleSportToggle(sport)}
                          className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 focus:ring-offset-0 transition-colors cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                          {sport}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Option Autre */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Autre sport (non listé)
                </label>
                <input
                  type="text"
                  name="otherSport"
                  placeholder="Précisez ici..."
                  value={formData.otherSport}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-orange-400 outline-none transition-colors text-sm text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Bouton Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'INSCRIPTION…' : "S'INSCRIRE"}
          </button>
        </form>

        {/* Lien vers connexion */}
        <div className="text-center mt-6">
          <p className="text-gray-700">
            Déjà un compte ?{' '}
            <Link
              href="/login"
              className="underline hover:text-orange-500 transition-colors font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}