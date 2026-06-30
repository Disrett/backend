'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import {
  User, CreditCard, Palette, Accessibility, Bell, Shield,
  ChevronRight, Camera, Moon, Sun, Monitor,
  Smartphone, Mail, MessageCircle, Heart, Users, Lock,
  Trash2, LogOut, Check
} from 'lucide-react';

const SECTIONS = [
  { key: 'profil',          label: 'Profil',          icon: User },
  { key: 'compte',          label: 'Compte',          icon: CreditCard },
  { key: 'apparence',       label: 'Apparence',       icon: Palette },
  { key: 'accessibilite',   label: 'Accessibilité',   icon: Accessibility },
  { key: 'notifications',   label: 'Notifications',   icon: Bell },
  { key: 'confidentialite', label: 'Confidentialité', icon: Shield },
];

/* ── Composants de sections ────────────────────────────────── */

const ALL_SPORTS = [
  // Sports collectifs
  { emoji: '⚽', label: 'Football' },
  { emoji: '🏀', label: 'Basketball' },
  { emoji: '🏈', label: 'Football américain' },
  { emoji: '⚾', label: 'Baseball' },
  { emoji: '🥎', label: 'Softball' },
  { emoji: '🏐', label: 'Volleyball' },
  { emoji: '🏉', label: 'Rugby' },
  { emoji: '🎾', label: 'Tennis' },
  { emoji: '🏸', label: 'Badminton' },
  { emoji: '🏓', label: 'Tennis de table' },
  { emoji: '🥏', label: 'Ultimate frisbee' },
  { emoji: '🏑', label: 'Hockey sur gazon' },
  { emoji: '🏒', label: 'Hockey sur glace' },
  { emoji: '🥍', label: 'Lacrosse' },
  { emoji: '🏏', label: 'Cricket' },
  { emoji: '🏑', label: 'Crosse' },
  { emoji: '🤺', label: 'Escrime' },
  { emoji: '🏐', label: 'Beach Volley' },
  { emoji: '🤾', label: 'Handball' },
  { emoji: '🥅', label: 'Futsal' },
  { emoji: '🏒', label: 'Floorball' },
  { emoji: '🎱', label: 'Billard' },
  { emoji: '🏸', label: 'Squash' },
  { emoji: '🎯', label: 'Fléchettes' },
  // Athlétisme & course
  { emoji: '🏃', label: 'Course à pied' },
  { emoji: '🏇', label: 'Sprint' },
  { emoji: '🚶', label: 'Marche athlétique' },
  { emoji: '🏔️', label: 'Trail' },
  { emoji: '🗺️', label: 'Course d\'orientation' },
  { emoji: '🏋️', label: 'Lancer du poids' },
  { emoji: '🥇', label: 'Décathlon' },
  { emoji: '🤸', label: 'Saut en hauteur' },
  { emoji: '🏹', label: 'Saut à la perche' },
  { emoji: '🌀', label: 'Lancer du disque' },
  { emoji: '🎿', label: 'Saut à ski' },
  // Cyclisme
  { emoji: '🚴', label: 'Cyclisme' },
  { emoji: '🚵', label: 'VTT' },
  { emoji: '🛣️', label: 'Cyclisme sur route' },
  { emoji: '🏁', label: 'BMX' },
  { emoji: '⚡', label: 'Cyclisme sur piste' },
  // Natation & sports aquatiques
  { emoji: '🏊', label: 'Natation' },
  { emoji: '🤽', label: 'Water-polo' },
  { emoji: '🤿', label: 'Plongée' },
  { emoji: '🏄', label: 'Surf' },
  { emoji: '🚣', label: 'Aviron' },
  { emoji: '🛶', label: 'Canoë-kayak' },
  { emoji: '🌊', label: 'Natation en eau libre' },
  { emoji: '🏊', label: 'Natation synchronisée' },
  { emoji: '⛵', label: 'Voile' },
  { emoji: '🚤', label: 'Ski nautique' },
  { emoji: '🪂', label: 'Kitesurf' },
  { emoji: '🏄', label: 'Wakeboard' },
  { emoji: '🤽', label: 'Polo aquatique' },
  { emoji: '🌊', label: 'Bodyboard' },
  { emoji: '🚣', label: 'Dragon boat' },
  // Sports de combat
  { emoji: '🥊', label: 'Boxe' },
  { emoji: '🥋', label: 'Judo' },
  { emoji: '🥋', label: 'Karaté' },
  { emoji: '🥋', label: 'Taekwondo' },
  { emoji: '🤼', label: 'Lutte' },
  { emoji: '🥋', label: 'Jiu-jitsu brésilien' },
  { emoji: '🥊', label: 'Muay Thaï' },
  { emoji: '🥋', label: 'Kung-fu' },
  { emoji: '🥋', label: 'Aïkido' },
  { emoji: '🥋', label: 'Sambo' },
  { emoji: '🥊', label: 'Kickboxing' },
  { emoji: '🤼', label: 'Sumo' },
  { emoji: '🥋', label: 'MMA' },
  { emoji: '🥋', label: 'Capoeira' },
  // Gymnastique & acrobatie
  { emoji: '🤸', label: 'Gymnastique artistique' },
  { emoji: '🎀', label: 'Gymnastique rythmique' },
  { emoji: '🤸', label: 'Trampoline' },
  { emoji: '🤸', label: 'Parkour' },
  { emoji: '🎪', label: 'Acrobatie' },
  { emoji: '🧗', label: 'Escalade' },
  // Sports d'hiver
  { emoji: '⛷️', label: 'Ski alpin' },
  { emoji: '🎿', label: 'Ski de fond' },
  { emoji: '🏂', label: 'Snowboard' },
  { emoji: '⛸️', label: 'Patinage artistique' },
  { emoji: '⛸️', label: 'Patinage de vitesse' },
  { emoji: '🛷', label: 'Luge' },
  { emoji: '🛷', label: 'Bobsleigh' },
  { emoji: '🥌', label: 'Curling' },
  { emoji: '🏒', label: 'Patinage sur glace' },
  { emoji: '🎿', label: 'Biathlon' },
  { emoji: '🏔️', label: 'Ski de randonnée' },
  { emoji: '🏂', label: 'Freestyle ski' },
  // Sports de force & fitness
  { emoji: '🏋️', label: 'Musculation' },
  { emoji: '🏋️', label: 'Haltérophilie' },
  { emoji: '💪', label: 'CrossFit' },
  { emoji: '🧘', label: 'Yoga' },
  { emoji: '🧘', label: 'Pilates' },
  { emoji: '🤸', label: 'Calisthenics' },
  { emoji: '🏃', label: 'Fitness' },
  { emoji: '🥊', label: 'Boxe fitness' },
  { emoji: '💃', label: 'Zumba' },
  // Sports de raquette
  { emoji: '🎾', label: 'Padel' },
  { emoji: '🏸', label: 'Racquetball' },
  // Sports équestres
  { emoji: '🏇', label: 'Équitation' },
  { emoji: '🐎', label: 'Saut d\'obstacles' },
  { emoji: '🐴', label: 'Polo' },
  { emoji: '🏇', label: 'Course hippique' },
  { emoji: '🐎', label: 'Dressage' },
  // Sports mécaniques
  { emoji: '🏎️', label: 'Formule 1' },
  { emoji: '🏍️', label: 'Moto GP' },
  { emoji: '🚗', label: 'Rallye' },
  { emoji: '🛵', label: 'Motocross' },
  { emoji: '🏎️', label: 'Karting' },
  // Sports aériens
  { emoji: '🪂', label: 'Parachutisme' },
  { emoji: '🦅', label: 'Vol libre' },
  { emoji: '🪂', label: 'Parapente' },
  { emoji: '🛩️', label: 'Vol à voile' },
  { emoji: '🪁', label: 'BASE jump' },
  // Sports de précision & tir
  { emoji: '🎯', label: 'Tir à l\'arc' },
  { emoji: '🔫', label: 'Tir sportif' },
  { emoji: '🎳', label: 'Bowling' },
  { emoji: '⛳', label: 'Golf' },
  { emoji: '🎣', label: 'Pêche sportive' },
  // Sports de plein air & aventure
  { emoji: '🧗', label: 'Alpinisme' },
  { emoji: '🏕️', label: 'Randonnée' },
  { emoji: '🪓', label: 'Survie' },
  { emoji: '🤿', label: 'Apnée' },
  { emoji: '🌊', label: 'Rafting' },
  // Multi-sports
  { emoji: '🏊🚴🏃', label: 'Triathlon' },
  { emoji: '🗺️', label: 'Biathlon' },
  { emoji: '🥇', label: 'Pentathlon moderne' },
  // E-sport
  { emoji: '🎮', label: 'E-sport' },
  // Danse sportive
  { emoji: '💃', label: 'Danse sportive' },
  { emoji: '🕺', label: 'Break dance' },
  // Autres
  { emoji: '🏹', label: 'Tir à la corde' },
  { emoji: '🎽', label: 'Athlétisme' },
  { emoji: '🧩', label: 'Échecs sportifs' },
];

function SectionProfil() {
  const [selectedSports, setSelectedSports] = useState(['Cyclisme', 'Trail']);
  const [search, setSearch] = useState('');

  const toggleSport = (label) => {
    setSelectedSports((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const filtered = ALL_SPORTS.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="param-section">
      <h2 className="param-section-title">Profil</h2>
      <p className="param-section-desc">Ces informations sont visibles par les autres membres.</p>

      <div className="param-avatar-row">
        <div className="param-avatar-wrap">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Avatar" className="param-avatar" />
          <button className="param-avatar-btn"><Camera size={16} /></button>
        </div>
        <div>
          <p className="param-avatar-label">Photo de profil</p>
          <p className="param-avatar-hint">JPG, PNG · max 5 Mo</p>
        </div>
      </div>

      <div className="param-fields">
        <div className="param-field-row">
          <div className="param-field">
            <label>Prénom</label>
            <input type="text" defaultValue="Alexandre" placeholder="Prénom" />
          </div>
          <div className="param-field">
            <label>Nom</label>
            <input type="text" defaultValue="Martin" placeholder="Nom" />
          </div>
        </div>
        <div className="param-field">
          <label>Nom d'utilisateur</label>
          <input type="text" defaultValue="@alexandre.martin" placeholder="@nom_utilisateur" />
        </div>
        <div className="param-field">
          <label>Bio</label>
          <textarea rows={3} defaultValue="Passionné de cyclisme et de trail 🚴 · Coach sportif certifié · #SansLimites" placeholder="Parle de toi..." />
        </div>
        <div className="param-field">
          <label>Localisation</label>
          <input type="text" defaultValue="Lyon, France" placeholder="Ville, Pays" />
        </div>

        {/* ── SÉLECTION DES SPORTS ── */}
        <div className="param-field">
          <label>Mes sports</label>
          {selectedSports.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {selectedSports.map((s) => {
                const sport = ALL_SPORTS.find((sp) => sp.label === s);
                return (
                  <span key={s} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: '#0047AB', color: '#fff', borderRadius: '20px',
                    padding: '4px 10px', fontSize: '13px', fontWeight: 600,
                  }}>
                    {sport?.emoji} {s}
                    <button onClick={() => toggleSport(s)} style={{
                      background: 'none', border: 'none', color: '#fff',
                      cursor: 'pointer', padding: '0 0 0 4px', fontSize: '14px', lineHeight: 1,
                    }}>×</button>
                  </span>
                );
              })}
            </div>
          )}
          <input
            type="text"
            placeholder="🔍 Rechercher un sport..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '4px 2px',
          }}>
            {filtered.map(({ emoji, label }) => {
              const isSelected = selectedSports.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleSport(label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                    border: isSelected ? '2px solid #0047AB' : '1.5px solid #dbe4f2',
                    background: isSelected ? '#eef3ff' : '#fff',
                    color: isSelected ? '#0047AB' : '#4a5568',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '13px',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{emoji}</span>
                  <span style={{ lineHeight: 1.2 }}>{label}</span>
                  {isSelected && <Check size={13} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>Aucun sport trouvé pour "{search}".</p>
          )}
        </div>
      </div>

      <div className="param-actions">
        <button className="param-btn-save">Enregistrer les modifications</button>
      </div>
    </div>
  );
}

function SectionCompte() {
  const [showQr, setShowQr] = useState(false);
  const [phone, setPhone] = useState('');
  const qrSeed = Math.random().toString(36).substring(2, 10);

  return (
    <div className="param-section">
      <h2 className="param-section-title">Compte</h2>
      <p className="param-section-desc">Gère ton adresse e-mail, ton mot de passe et la sécurité de ton compte.</p>

      <div className="param-group">
        <h3 className="param-group-title">Adresse e-mail</h3>
        <div className="param-field">
          <label>E-mail actuel</label>
          <input type="email" defaultValue="alexandre.martin@email.com" />
        </div>
        <button className="param-btn-secondary">Changer l'adresse e-mail</button>
      </div>

      <div className="param-group" style={{ gap: '8px' }}>
        <h3 className="param-group-title" style={{ marginBottom: '0' }}>Mot de passe</h3>
        <button className="param-btn-secondary">Mettre à jour le mot de passe</button>
      </div>

      <div className="param-group">
        <h3 className="param-group-title">Application d'authentification</h3>
        <p className="param-section-desc" style={{ marginTop: '-8px', marginBottom: '12px' }}>
          Scanne ce QR Code avec ton application d'authentification (Google Authenticator, Authy…) pour activer la double authentification.
        </p>
        <button
          className="param-btn-secondary"
          onClick={() => setShowQr(!showQr)}
        >
          {showQr ? 'Masquer le QR Code' : 'Afficher le QR Code'}
        </button>
        {showQr && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=otpauth://totp/SANSLimites:alexandre.martin@email.com?secret=${qrSeed}&issuer=SANSLimites`}
              alt="QR Code d'authentification"
              style={{ borderRadius: '8px', border: '1px solid #e2e8f0', padding: '8px', background: '#fff' }}
            />
            <p style={{ fontSize: '12px', color: '#64748b' }}>Scanne ce code avec ton application, puis entre le code généré pour confirmer.</p>
          </div>
        )}
      </div>

      <div className="param-group">
        <h3 className="param-group-title">Authentification de secours par SMS</h3>
        <p className="param-section-desc" style={{ marginTop: '-8px', marginBottom: '12px' }}>
          En cas de perte d'accès à ton application d'authentification, un code de secours sera envoyé par SMS sur ce numéro.
        </p>
        <div className="param-field" style={{ marginBottom: '12px' }}>
          <label>Numéro de téléphone</label>
          <input
            type="tel"
            placeholder="+33 6 00 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="param-btn-secondary" style={{ marginTop: '0', height: '38px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', boxSizing: 'border-box' }}>Enregistrer</button>
          <button className="param-btn-danger-outline" style={{ height: '38px', padding: '0 16px', boxSizing: 'border-box' }}><Trash2 size={16} /> Supprimer</button>
        </div>
      </div>

      <div className="param-group param-danger-group">
        <h3 className="param-group-title danger">Zone de danger</h3>
        <div className="param-danger-actions">
          <button className="param-btn-danger-outline"><LogOut size={16} /> Se déconnecter</button>
          <button className="param-btn-danger"><Trash2 size={16} /> Supprimer mon compte</button>
        </div>
      </div>
    </div>
  );
}

function SectionApparence() {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('medium');

  const themes = [
    { key: 'light',  label: 'Clair',    icon: Sun },
    { key: 'dark',   label: 'Sombre',   icon: Moon },
    { key: 'system', label: 'Système',  icon: Monitor },
  ];

  const fontSizes = [
    { key: 'small',  label: 'Petite' },
    { key: 'medium', label: 'Normale' },
    { key: 'large',  label: 'Grande' },
  ];

  return (
    <div className="param-section">
      <h2 className="param-section-title">Apparence</h2>
      <p className="param-section-desc">Personnalise l'affichage de l'application à ton goût.</p>

      <div className="param-group">
        <h3 className="param-group-title">Thème</h3>
        <div className="param-theme-grid">
          {themes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`param-theme-btn${theme === key ? ' active' : ''}`}
            >
              <Icon size={24} />
              <span>{label}</span>
              {theme === key && <Check size={14} className="param-theme-check" />}
            </button>
          ))}
        </div>
      </div>

      <div className="param-group">
        <h3 className="param-group-title">Taille du texte</h3>
        <div className="param-fontsize-row">
          {fontSizes.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFontSize(key)}
              className={`param-fontsize-btn${fontSize === key ? ' active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="param-preview-text" style={{ fontSize: fontSize === 'small' ? '13px' : fontSize === 'large' ? '17px' : '15px' }}>
          Aperçu — Repousse tes limites chaque jour 💪
        </p>
      </div>

      <div className="param-group">
        <h3 className="param-group-title">Langue</h3>
        <div className="param-field">
          <select defaultValue="fr">
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="pt">🇧🇷 Português (Brasil)</option>
            <option value="ar">🇸🇦 العربية</option>
            <option value="zh">🇨🇳 中文 (简体)</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="ko">🇰🇷 한국어</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="nl">🇳🇱 Nederlands</option>
            <option value="tr">🇹🇷 Türkçe</option>
            <option value="pl">🇵🇱 Polski</option>
            <option value="hi">🇮🇳 हिन्दी</option>
            <option value="id">🇮🇩 Bahasa Indonesia</option>
          </select>
        </div>
      </div>

      <div className="param-actions">
        <button className="param-btn-save">Enregistrer</button>
      </div>
    </div>
  );
}

function SectionAccessibilite() {
  const [opts, setOpts] = useState({
    reduceMotion: false,
    highContrast: false,
    largeTargets: false,
    screenReader: false,
    captions: false,
  });

  const toggle = (key) => setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  const options = [
    { key: 'reduceMotion',  label: 'Réduire les animations',              desc: 'Limite les transitions et effets visuels.' },
    { key: 'highContrast',  label: 'Contraste élevé',                     desc: 'Augmente le contraste pour une meilleure lisibilité.' },
    { key: 'largeTargets',  label: 'Zones de clic agrandies',             desc: 'Élargit les boutons et liens pour faciliter le clic.' },
    { key: 'screenReader',  label: 'Optimisation lecteur d\'écran',        desc: 'Améliore la compatibilité avec les lecteurs d\'écran.' },
    { key: 'captions',      label: 'Sous-titres sur les vidéos',           desc: 'Affiche les sous-titres automatiquement.' },
  ];

  return (
    <div className="param-section">
      <h2 className="param-section-title">Accessibilité</h2>
      <p className="param-section-desc">Sans Limites est conçu pour être accessible à tous. Adapte l'expérience à tes besoins.</p>

      <div className="param-group">
        {options.map(({ key, label, desc }) => (
          <div key={key} className="param-toggle-row">
            <div>
              <p className="param-toggle-label">{label}</p>
              <p className="param-toggle-desc">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`param-toggle${opts[key] ? ' on' : ''}`}
              aria-pressed={opts[key]}
            >
              <span className="param-toggle-knob" />
            </button>
          </div>
        ))}
      </div>

      <div className="param-actions">
        <button className="param-btn-save">Enregistrer</button>
      </div>
    </div>
  );
}

function SectionNotifications() {
  const [notifs, setNotifs] = useState({
    likesEmail: true,  likesPush: true,
    commentsEmail: true, commentsPush: true,
    followsEmail: false, followsPush: true,
    messagesEmail: true, messagesPush: true,
    eventsEmail: false, eventsPush: false,
  });

  const toggle = (key) => setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  const rows = [
    { label: 'Likes sur mes publications',  icon: Heart,          emailKey: 'likesEmail',    pushKey: 'likesPush' },
    { label: 'Commentaires',                icon: MessageCircle,  emailKey: 'commentsEmail', pushKey: 'commentsPush' },
    { label: 'Nouveaux abonnés',            icon: Users,          emailKey: 'followsEmail',  pushKey: 'followsPush' },
    { label: 'Messages privés',             icon: Mail,           emailKey: 'messagesEmail', pushKey: 'messagesPush' },
    { label: 'Événements à venir',          icon: Bell,           emailKey: 'eventsEmail',   pushKey: 'eventsPush' },
  ];

  return (
    <div className="param-section">
      <h2 className="param-section-title">Notifications</h2>
      <p className="param-section-desc">Choisis comment et quand tu souhaites être notifié.</p>

      <div className="param-group">
        <div className="param-notif-header">
          <span />
          <span className="param-notif-col-label"><Mail size={14} /> E-mail</span>
          <span className="param-notif-col-label"><Smartphone size={14} /> Push</span>
        </div>
        {rows.map(({ label, icon: Icon, emailKey, pushKey }) => (
          <div key={label} className="param-notif-row">
            <span className="param-notif-label"><Icon size={16} /> {label}</span>
            <button onClick={() => toggle(emailKey)} className={`param-toggle small${notifs[emailKey] ? ' on' : ''}`} aria-pressed={notifs[emailKey]}>
              <span className="param-toggle-knob" />
            </button>
            <button onClick={() => toggle(pushKey)} className={`param-toggle small${notifs[pushKey] ? ' on' : ''}`} aria-pressed={notifs[pushKey]}>
              <span className="param-toggle-knob" />
            </button>
          </div>
        ))}
      </div>

      <div className="param-actions">
        <button className="param-btn-save">Enregistrer</button>
      </div>
    </div>
  );
}

function SectionConfidentialite() {
  const [priv, setPriv] = useState({
    profilePublic: true,
    activitiesPublic: false,
    showLocation: true,
    allowMessages: true,
    showOnline: true,
  });

  const toggle = (key) => setPriv((prev) => ({ ...prev, [key]: !prev[key] }));

  const options = [
    { key: 'profilePublic',    label: 'Profil public',              desc: 'Tout le monde peut voir ton profil.' },
    { key: 'activitiesPublic', label: 'Activités visibles par tous', desc: 'Tes performances sont accessibles sans abonnement.' },
    { key: 'showLocation',     label: 'Afficher ma localisation',   desc: 'Ta ville est visible sur ton profil.' },
    { key: 'allowMessages',    label: 'Autoriser les messages',      desc: 'Les membres peuvent t\'envoyer des messages privés.' },
    { key: 'showOnline',       label: 'Afficher ma présence',        desc: 'Les autres voient quand tu es en ligne.' },
  ];

  return (
    <div className="param-section">
      <h2 className="param-section-title">Confidentialité</h2>
      <p className="param-section-desc">Contrôle qui peut voir tes informations et interagir avec toi.</p>

      <div className="param-group">
        {options.map(({ key, label, desc }) => (
          <div key={key} className="param-toggle-row">
            <div>
              <p className="param-toggle-label">{label}</p>
              <p className="param-toggle-desc">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`param-toggle${priv[key] ? ' on' : ''}`}
              aria-pressed={priv[key]}
            >
              <span className="param-toggle-knob" />
            </button>
          </div>
        ))}
      </div>

      <div className="param-actions">
        <button className="param-btn-save">Enregistrer</button>
      </div>
    </div>
  );
}

/* ── Page principale ───────────────────────────────────────── */

const SECTION_COMPONENTS = {
  profil:          SectionProfil,
  compte:          SectionCompte,
  apparence:       SectionApparence,
  accessibilite:   SectionAccessibilite,
  notifications:   SectionNotifications,
  confidentialite: SectionConfidentialite,
};

export default function ParametresPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('profil');

  const ActiveComponent = SECTION_COMPONENTS[activeSection];

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

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="param-page-title">Paramètres</h1>

            <div className="param-layout">

              {/* ── NAV LATÉRALE ── */}
              <nav className="param-nav">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`param-nav-btn${activeSection === key ? ' active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                    <ChevronRight size={16} className="param-nav-arrow" />
                  </button>
                ))}
              </nav>

              {/* ── CONTENU ── */}
              <div className="param-content">
                <ActiveComponent />
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
