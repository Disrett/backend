'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/components/sidebar';
import MobileMenu from '@/app/components/mobilemenu';
import Header from '@/app/components/header';
import ProfileHeader from '@/app/components/ProfileHeader';
import PublicationsGrid from '@/app/components/PublicationsGrid';
import ObjectivesAndChallenges from '@/app/components/ObjectivesAndChallenges';
import { mockUser, mockPublications } from '@/app/lib/mockData';


export default function ProfilPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { key: 'overview',   label: "Vue d'ensemble" },
    { key: 'activities', label: 'Activités' },
    { key: 'challenges', label: 'Défis' },
  ];

  const tabIndex = tabs.findIndex((t) => t.key === activeTab);

  const stats = [
    { label: 'Activités',   value: '248' },
    { label: 'km Total',    value: '3 412' },
    { label: 'Heures',      value: '187' },
    { label: 'Abonnés',     value: '1.2k' },
    { label: 'Abonnements', value: '340' },
  ];

  const challenges = [
    { name: 'Juin 100 km',  pct: 60, icon: '🏆' },
    { name: 'Gran Fondo',   pct: 40, icon: '🚴' },
    { name: 'Morning Club', pct: 80, icon: '🌅' },
    { name: 'KOM Hunter',   pct: 25, icon: '⛰️' },
  ];

  return (
    <div className="flex h-screen bg-[#f3f6fb] overflow-hidden">

      {/* ── SIDEBAR ── */}
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />

      {/* ── MENU MOBILE ── */}
      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      {/* ── CONTENU PRINCIPAL ── */}
      <div
        className="lg:ml-64 flex-1 flex flex-col w-full"
        onClick={() => setShowMenu(false)}
      >
        {/* ── HEADER ── */}
        <Header setShowMobileMenu={setShowMobileMenu} />

        {/* ── PAGE PROFIL ── */}
        <main className="flex-1 overflow-y-auto profil-page">

          <div className="profil-container">

            {/* ── HEADER CARD ── */}
            <div className="header-card">
              <ProfileHeader user={mockUser} isOwnProfile={true} />
            </div>

            {/* ── STATS BAR ── */}
            <div className="stats-bar">
              {stats.map((stat) => (
                <div className="stat-item" key={stat.label}>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* ── TABS ── */}
            <nav className="profil-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
              <div
                className="tab-indicator"
                style={{ transform: `translateX(${tabIndex * 100}%)` }}
              />
            </nav>

            {/* ── CONTENT ── */}
            <div className="content-layout">

              {/* ── ASIDE ── */}
              <aside className="sidebar">

                <div className="sidebar-card">
                  <h3 className="card-title">
                    <span className="title-icon">🏅</span> Trophées récents
                  </h3>
                  <div className="trophy-grid">
                    {['🥇', '🚴', '⚡', '🔥', '🏔️', '💪'].map((t, i) => (
                      <div
                        className="trophy-item"
                        key={i}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card">
                  <h3 className="card-title">
                    <span className="title-icon">🎯</span> Objectif semaine
                  </h3>
                  <div className="goal-meta">
                    <span className="goal-current">47 km</span>
                    <span className="goal-target"> / 80 km</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '58%' }} />
                  </div>
                  <p className="goal-label">58 % accompli · 3 jours restants</p>
                </div>

                <div className="sidebar-card">
                  <ObjectivesAndChallenges
                    objectives={mockUser.objectives}
                    challenges={mockUser.challenges}
                  />
                </div>

              </aside>

              {/* ── FEED ── */}
              <main className="feed-column">

                {(activeTab === 'overview' || activeTab === 'activities') && (
                  <section>
                    <div className="section-header">
                      <h2 className="section-title">Activités récentes</h2>
                      <button className="btn-secondary">Tout voir</button>
                    </div>
                    <PublicationsGrid publications={mockPublications} />
                  </section>
                )}

                {activeTab === 'challenges' && (
                  <section>
                    <div className="section-header">
                      <h2 className="section-title">Défis en cours</h2>
                    </div>
                    <div className="challenges-grid">
                      {challenges.map((c, i) => (
                        <div
                          className="challenge-card"
                          key={i}
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div className="challenge-icon">{c.icon}</div>
                          <p className="challenge-name">{c.name}</p>
                          <div className="challenge-bar">
                            <div className="challenge-fill" style={{ width: `${c.pct}%` }} />
                          </div>
                          <span className="challenge-pct">{c.pct} %</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </main>
            </div>

            {/* ── SPACER ── */}
            <div style={{ height: '60px' }} />

          </div>
        </main>
      </div>
    </div>
  );
}
