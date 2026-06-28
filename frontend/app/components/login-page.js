'use client';

import { useState, useMemo } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '../lib/api';
import { saveTokens, saveUser } from '../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);
    try {
      // POST /api/auth/login → { accessToken, refreshToken }
      const tokens = await api.login({
        email: formData.email,
        password: formData.password,
      });
      saveTokens(tokens);
      saveUser({ email: formData.email });
      // Connexion réussie → redirection vers le fil d'actualité
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
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-light text-center mb-4 text-gray-800 tracking-wide">
          CONNEXION
        </h1>

        {/* Logo Sans Limite */}
        <div className="flex justify-center mb-4">
          <img 
            src="/sans_limite_logo.png" 
            alt="Sans Limite" 
            className="w-20 h-20 object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'erreur renvoyé par le backend */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
              {error}
            </div>
          )}

          {/* Champ Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 placeholder-gray-400"
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
              className="w-full pl-12 pr-12 py-4 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none transition-colors text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Bouton Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'CONNEXION…' : 'SE CONNECTER'}
          </button>
        </form>

        {/* Lien vers inscription */}
        <div className="text-center mt-6">
          <p className="text-gray-700">
            Pas de compte ?{' '}
            <Link
              href="/signup"
              className="underline hover:text-orange-500 transition-colors font-medium"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
