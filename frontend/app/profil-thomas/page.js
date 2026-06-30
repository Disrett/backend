'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/app/components/sidebar';
import MobileMenu from '@/app/components/mobilemenu';
import Header from '@/app/components/header';
import {
  MapPin, ArrowLeft, BarChart3, Target, ThumbsUp, Share2,
  MessageCircle, CheckCircle2, Activity, Flame, Lock, Pencil
} from 'lucide-react';

/* ════════════════════════════════════════
   DONNÉES
════════════════════════════════════════ */
const allSessions = [
  { id: 1,   date: '2025-11-03', type: 'swim', title: 'Découverte crawl',           duration: 40,  distance: 0.6,  pace: '4:10/100m', calories: 280,  details: '4×50m éducatifs + 4×50m crawl complet. Focus respiration latérale.',                                                                       rpe: 6,  feeling: 'ok',    phase: 1, likes: 3  },
  { id: 2,   date: '2025-11-05', type: 'run',  title: 'Footing découverte',          duration: 25,  distance: 3.2,  pace: '7:49/km',   calories: 260,  details: 'Alternance marche/course : 3min course + 2min marche × 5. Bords de Garonne.',                                                              rpe: 5,  feeling: 'good',  phase: 1, likes: 5  },
  { id: 3,   date: '2025-11-08', type: 'bike', title: 'Première sortie vélo',        duration: 45,  distance: 15,   pace: '20.0 km/h', calories: 340,  details: 'Piste cyclable canal du Midi. Apprentissage des vitesses.',                                                                                  rpe: 4,  feeling: 'great', phase: 1, likes: 8  },
  { id: 4,   date: '2025-11-10', type: 'swim', title: 'Technique battements',        duration: 40,  distance: 0.7,  pace: '3:34/100m', calories: 290,  details: '200m échauffement, 6×50m battements planche, 4×50m crawl.',                                                                                 rpe: 6,  feeling: 'ok',    phase: 1, likes: 2  },
  { id: 5,   date: '2025-11-12', type: 'run',  title: 'Footing continu',             duration: 28,  distance: 3.5,  pace: '8:00/km',   calories: 270,  details: '3min course + 1min marche × 7.',                                                                                                            rpe: 5,  feeling: 'good',  phase: 1, likes: 4  },
  { id: 6,   date: '2025-11-14', type: 'bike', title: 'Vélo endurance douce',        duration: 50,  distance: 17,   pace: '20.4 km/h', calories: 370,  details: 'Canal du Midi direction Castanet. Rythme régulier, cadence ~85rpm.',                                                                        rpe: 4,  feeling: 'great', phase: 1, likes: 6  },
  { id: 9,   date: '2025-11-19', type: 'run',  title: 'Footing 30 min',              duration: 30,  distance: 4.0,  pace: '7:30/km',   calories: 290,  details: 'Premier footing de 30min continu sans marche ! Milestone !',                                                                               rpe: 6,  feeling: 'great', phase: 1, likes: 12 },
  { id: 10,  date: '2025-11-22', type: 'bike', title: 'Sortie vallonnée',            duration: 55,  distance: 18,   pace: '19.6 km/h', calories: 400,  details: 'Premières côtes légères direction Pech David.',                                                                                             rpe: 5,  feeling: 'good',  phase: 1, likes: 5  },
  { id: 16,  date: '2025-12-01', type: 'swim', title: '1000m continu ! 🎉',          duration: 45,  distance: 1.0,  pace: '2:48/100m', calories: 340,  details: 'Premier kilomètre nagé sans s\'arrêter ! Énorme pour moi.',                                                                                 rpe: 7,  feeling: 'great', phase: 1, likes: 18 },
  { id: 20,  date: '2025-12-08', type: 'run',  title: 'Footing 38 min — 5km ! 🎉',  duration: 38,  distance: 5.2,  pace: '7:18/km',   calories: 340,  details: '5km passé ! Premier vrai milestone en course.',                                                                                             rpe: 6,  feeling: 'great', phase: 1, likes: 22 },
  { id: 22,  date: '2025-12-12', type: 'bike', title: 'Sortie longue 1h10',          duration: 70,  distance: 24,   pace: '20.6 km/h', calories: 510,  details: 'Canal du Midi direction Montlaur. Vent de face à l\'aller.',                                                                                rpe: 6,  feeling: 'ok',    phase: 1, likes: 7  },
  { id: 24,  date: '2025-12-15', type: 'swim', title: '1200m continu',               duration: 50,  distance: 1.2,  pace: '2:37/100m', calories: 360,  details: '1200m crawl continu à allure régulière (2:05/100m).',                                                                                      rpe: 7,  feeling: 'good',  phase: 1, likes: 9  },
  { id: 25,  date: '2025-12-17', type: 'run',  title: 'Footing 40 min',              duration: 40,  distance: 5.5,  pace: '7:16/km',   calories: 350,  details: 'Premier 40min continu !',                                                                                                                   rpe: 6,  feeling: 'great', phase: 1, likes: 14 },
  { id: 26,  date: '2025-12-19', type: 'bike', title: 'Vélo endurance 1h15',         duration: 75,  distance: 26,   pace: '20.8 km/h', calories: 540,  details: 'Sortie régulière, objectif zone 2 cardio.',                                                                                                 rpe: 5,  feeling: 'good',  phase: 1, likes: 6  },
  { id: 34,  date: '2026-01-05', type: 'swim', title: '1500m continu ! 🏊🎉',        duration: 55,  distance: 1.5,  pace: '2:20/100m', calories: 400,  details: '1500m crawl continu en 35min ! Distance du triathlon nagée pour la première fois !!',                                                       rpe: 8,  feeling: 'great', phase: 2, likes: 31 },
  { id: 38,  date: '2026-01-11', type: 'run',  title: 'Sortie longue 50 min',        duration: 50,  distance: 6.8,  pace: '7:21/km',   calories: 410,  details: 'Plus longue course à ce jour !',                                                                                                            rpe: 7,  feeling: 'great', phase: 2, likes: 11 },
  { id: 39,  date: '2026-01-12', type: 'bike', title: 'Sortie longue 1h30',          duration: 90,  distance: 32,   pace: '21.3 km/h', calories: 650,  details: 'Première grosse sortie vélo. 32km avalés !',                                                                                                rpe: 7,  feeling: 'good',  phase: 2, likes: 13 },
  { id: 46,  date: '2026-01-22', type: 'bike', title: 'Enchaînement V→C #1',         duration: 75,  distance: 25,   pace: '—',         calories: 570,  details: '1h vélo + 15min course directement après. PREMIER ENCHAÎNEMENT !',                                                                          rpe: 8,  feeling: 'ok',    phase: 2, likes: 19 },
  { id: 52,  date: '2026-02-01', type: 'run',  title: 'Footing 1h ! 🎉',             duration: 60,  distance: 8.2,  pace: '7:19/km',   calories: 480,  details: 'PREMIER FOOTING D\'1H !! 8.2km. Milestone énorme.',                                                                                        rpe: 7,  feeling: 'great', phase: 2, likes: 28 },
  { id: 58,  date: '2026-02-11', type: 'swim', title: '2000m continu ! 🎉',          duration: 60,  distance: 2.0,  pace: '1:57/100m', calories: 440,  details: '2KM !! Objectif natation dépassé. Confiance au top.',                                                                                      rpe: 8,  feeling: 'great', phase: 2, likes: 35 },
  { id: 67,  date: '2026-02-26', type: 'bike', title: '40km !! 🚴🎉',                duration: 120, distance: 40,   pace: '20.0 km/h', calories: 860,  details: '40km !! Distance du triathlon faite en vélo !!',                                                                                            rpe: 8,  feeling: 'great', phase: 3, likes: 42 },
  { id: 72,  date: '2026-03-05', type: 'run',  title: '10KM !! 🏃🎉',               duration: 70,  distance: 10.0, pace: '7:00/km',   calories: 560,  details: 'PREMIER 10KM !! Temps : 1h10. Objectif course ATTEINT.',                                                                                    rpe: 8,  feeling: 'great', phase: 3, likes: 47 },
  { id: 79,  date: '2026-03-15', type: 'swim', title: 'Eau libre #1 !',              duration: 45,  distance: 1.2,  pace: '—',         calories: 370,  details: 'Première séance en eau libre au lac ! Combinaison néoprène.',                                                                               rpe: 7,  feeling: 'ok',    phase: 3, likes: 24 },
  { id: 88,  date: '2026-03-30', type: 'swim', title: '1500m eau libre : 29min10 !', duration: 55,  distance: 1.5,  pace: '1:57/100m', calories: 400,  details: '1500m eau libre chrono en 29min10 ! Record !',                                                                                              rpe: 8,  feeling: 'great', phase: 3, likes: 38 },
  { id: 89,  date: '2026-04-01', type: 'bike', title: 'Vélo 42km allure course',     duration: 120, distance: 42,   pace: '21.0 km/h', calories: 860,  details: '42km à allure course. Distance et allure du tri validées !',                                                                                rpe: 8,  feeling: 'great', phase: 3, likes: 29 },
  { id: 90,  date: '2026-04-02', type: 'run',  title: '10km record : 1h05 !',        duration: 65,  distance: 10.0, pace: '6:30/km',   calories: 560,  details: '10km en 1h05 ! Nouveau record.',                                                                                                            rpe: 8,  feeling: 'great', phase: 3, likes: 33 },
  { id: 97,  date: '2026-04-13', type: 'bike', title: 'Record : 48km !',             duration: 140, distance: 48,   pace: '20.6 km/h', calories: 1000, details: 'Record distance ! 48km. Je suis prêt.',                                                                                                    rpe: 8,  feeling: 'good',  phase: 3, likes: 21 },
  { id: 99,  date: '2026-04-16', type: 'triathlon', title: 'Mini-tri simulation !',  duration: 95,  distance: 25,   pace: '—',         calories: 750,  details: 'Mini-triathlon : 500m nata + 20km vélo + 4.5km course. Première SIMULATION complète !',                                                    rpe: 9,  feeling: 'great', phase: 3, likes: 52 },
  { id: 101, date: '2026-04-19', type: 'run',  title: '10km record : 1h02 ! 🔥',    duration: 62,  distance: 10.0, pace: '6:12/km',   calories: 560,  details: '10km en 1h02 ! Record absolu. De 7:49/km en novembre à 6:12 en avril. Transformation.',                                                    rpe: 8,  feeling: 'great', phase: 3, likes: 61 },
  { id: 102, date: '2026-04-20', type: 'swim', title: 'Allure + technique',          duration: 45,  distance: 1.3,  pace: '2:10/100m', calories: 370,  details: 'Séance mixte, focus fluidité.',                                                                                                             rpe: 5,  feeling: 'great', phase: 4, likes: 14 },
  { id: 103, date: '2026-04-22', type: 'bike', title: 'Vélo 1h cool',                duration: 60,  distance: 22,   pace: '22.0 km/h', calories: 440,  details: 'Sortie cool, quelques accélérations courtes.',                                                                                              rpe: 5,  feeling: 'great', phase: 4, likes: 8  },
  { id: 104, date: '2026-04-23', type: 'run',  title: 'Footing 40min léger',         duration: 40,  distance: 6.0,  pace: '6:40/km',   calories: 380,  details: 'Footing facile + 3×200m vite.',                                                                                                             rpe: 5,  feeling: 'great', phase: 4, likes: 11 },
  { id: 105, date: '2026-04-25', type: 'swim', title: 'Eau libre 1000m',             duration: 35,  distance: 1.0,  pace: '2:12/100m', calories: 320,  details: 'Dernière eau libre avant le jour J.',                                                                                                       rpe: 5,  feeling: 'great', phase: 4, likes: 16 },
  { id: 106, date: '2026-04-26', type: 'bike', title: 'Vélo 45min sprints',          duration: 45,  distance: 16,   pace: '21.3 km/h', calories: 340,  details: 'Sortie courte, quelques relances.',                                                                                                         rpe: 5,  feeling: 'great', phase: 4, likes: 9  },
  { id: 107, date: '2026-04-27', type: 'run',  title: 'Footing 25min',               duration: 25,  distance: 3.8,  pace: '6:35/km',   calories: 250,  details: 'Petit footing de maintien. J-6.',                                                                                                           rpe: 3,  feeling: 'great', phase: 4, likes: 17 },
  { id: 111, date: '2026-05-03', type: 'triathlon', title: '🏁 TRIATHLON M — FINISHER !!', duration: 173, distance: 51.5, pace: '—',   calories: 2400, details: '🏊 Natation 1500m : 32min\n🔄 T1 : 4min40\n🚴 Vélo 40km : 1h37min\n🔄 T2 : 2min30\n🏃 Course 10km : 1h20min\n\n⏱ TOTAL : 3h36mins\n🏅 FINISHER !! 312e / 520 partants.', rpe: 10, feeling: 'great', phase: 4, likes: 89 },
];

const thomas = {
  name: 'Thomas Lefèvre',
  username: '@thomas_tri',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThomasTri&backgroundColor=b6e3f4',
  bio: 'Passionné de triathlon 🏊🚴🏃 · De zéro à finisher en 7 mois · #SansLimites',
  location: 'Toulouse, France',
  joined: 'Novembre 2025',
  followers: 47,
  following: 82,
};

const sportMeta = {
  swim:      { icon: '🏊', label: 'Natation',  color: '#06b6d4', colorLight: '#e0f9ff' },
  bike:      { icon: '🚴', label: 'Vélo',       color: '#f59e0b', colorLight: '#fef9e7' },
  run:       { icon: '🏃', label: 'Course',     color: '#10b981', colorLight: '#e8fdf5' },
  triathlon: { icon: '🏁', label: 'Triathlon',  color: '#8b5cf6', colorLight: '#f3f0ff' },
};

/* Badges — unlocked = débloqué, locked = verrouillé */
const badges = [
  { id: 'premier_pas',      label: 'Premier pas',     desc: 'S\'inscrire et rejoindre l\'app',            color: '#22c55e',  unlocked: true  },
  { id: 'force_mental',     label: 'Force mental',    desc: '10 séances adaptées complétées',             color: '#ef4444',  unlocked: true  },
  { id: 'sport_collectif',  label: 'Sport Collectif', desc: 'Rejoindre un cours avec d\'autres utilisateurs', color: '#ec4899', unlocked: false },
  { id: 'coache',           label: 'Coaché-e',        desc: 'Suivre un coach',                            color: '#f472b6',  unlocked: false },
  { id: 'sans_limite',      label: 'Sans Limite',     desc: '30 jours actifs sur l\'application',         color: '#f97316',  unlocked: true  },
  { id: 'inclusion',        label: 'Inclusion',       desc: 'Interagir avec la section handisport',       color: '#f97316',  unlocked: false },
  { id: 'discipline',       label: 'Discipline',      desc: '14 jours avec mauvais 1 séance',             color: '#a855f7',  unlocked: true  },
  { id: 'a_lecoute',        label: 'À l\'écoute',     desc: 'Suivre un programme de coach',               color: '#a855f7',  unlocked: false },
  { id: 'en_mouvement',     label: 'En mouvement',    desc: 'Participer à 3 cours différents',            color: '#eab308',  unlocked: true  },
  { id: 'a_lafut',          label: 'À l\'affût',      desc: 'Suivre une compétition (JO, championnats…)', color: '#9ca3af',  unlocked: false },
  { id: 'regulier',         label: 'Régulier-e',      desc: '5 jours d\'activité régulière',              color: '#06b6d4',  unlocked: true  },
  { id: 'premier_post',     label: 'Premier Post',    desc: 'Publier un post ou une photo',               color: '#06b6d4',  unlocked: true  },
];

const mois        = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
const joursS      = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const feelEmoji   = { great:'🔥', good:'👍', ok:'😐', bad:'😞' };

function fmtDate(d)      { const x=new Date(d+'T12:00:00'); return `${x.getDate()} ${mois[x.getMonth()]} ${x.getFullYear()}`; }
function fmtDateShort(d) { const x=new Date(d+'T12:00:00'); return `${x.getDate()} ${mois[x.getMonth()]}`; }
function fmtDay(d)       { return joursS[new Date(d+'T12:00:00').getDay()]; }
function fmtDur(m)       { const h=Math.floor(m/60),mn=m%60; return h>0?`${h}h${mn.toString().padStart(2,'0')}`:`${mn}min`; }

/* ── Badge SVG étoile (style des captures) ── */
function BadgeShape({ color, icon, size=56, locked=false }) {
  const c = locked ? '#4b5563' : color;
  const s = size;
  const points = Array.from({length:8},(_,i)=>{
    const angle = (i*45 - 22.5) * Math.PI/180;
    const r = i%2===0 ? s*0.48 : s*0.34;
    return `${s/2+r*Math.cos(angle)},${s/2+r*Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <polygon points={points} fill={locked ? '#1f2937' : c+'22'} stroke={c} strokeWidth="2.5"/>
      <polygon points={Array.from({length:8},(_,i)=>{
        const angle=(i*45-22.5)*Math.PI/180;
        const r=i%2===0?s*0.35:s*0.24;
        return `${s/2+r*Math.cos(angle)},${s/2+r*Math.sin(angle)}`;
      }).join(' ')} fill={c} opacity={locked?0.3:0.9}/>
      <text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.28} fill={locked?'#6b7280':'white'}>{icon}</text>
    </svg>
  );
}

/* ── Calendrier ── */
function ActivityCalendar({ sessions }) {
  const today = new Date('2026-05-03T12:00:00');
  const WEEKS = 10;
  const days  = [];
  for (let i=WEEKS*7-1; i>=0; i--) {
    const d  = new Date(today); d.setDate(today.getDate()-i);
    const ds = d.toISOString().split('T')[0];
    days.push({ date:ds, items:sessions.filter(s=>s.date===ds) });
  }
  const cols = [];
  for (let w=0;w<WEEKS;w++) cols.push(days.slice(w*7,w*7+7));
  const dayL = ['D','L','M','M','J','V','S'];
  return (
    <div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1 pt-5">
          {dayL.map((l,i)=>(
            <div key={i} className="h-4 flex items-center">
              <span className="text-[9px] text-gray-400 w-3">{i%2===1?l:''}</span>
            </div>
          ))}
        </div>
        {cols.map((week,wi)=>{
          const fd   = new Date(week[0].date+'T12:00:00');
          const show = wi===0 || fd.getDate()<=7;
          return (
            <div key={wi} className="flex flex-col gap-1">
              <span className="text-[9px] text-gray-400 h-4 leading-4">{show?mois[fd.getMonth()]:''}</span>
              {week.map((day,di)=>{
                const has  = day.items.length>0;
                const type = has ? day.items[0].type : null;
                const col  = type ? sportMeta[type]?.color : null;
                return (
                  <div key={di}
                    title={has?`${fmtDateShort(day.date)}: ${day.items.map(s=>s.title).join(', ')}`:fmtDateShort(day.date)}
                    className="w-4 h-4 rounded-sm cursor-pointer transition-transform hover:scale-125"
                    style={{ backgroundColor: has?col:'#e5e7eb' }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-2 flex-wrap">
        {Object.entries(sportMeta).map(([k,v])=>(
          <div key={k} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{backgroundColor:v.color}}/>
            <span className="text-[10px] text-gray-400">{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Graphique barres ── */
function WeeklyChart({ sessions, activeType }) {
  const today = new Date('2026-05-03T12:00:00');
  const data  = [];
  for (let w=11;w>=0;w--) {
    const start=new Date(today); start.setDate(today.getDate()-w*7-6);
    const end  =new Date(today); end.setDate(today.getDate()-w*7);
    const ws   = sessions.filter(s=>{
      const d=new Date(s.date+'T12:00:00');
      return d>=start&&d<=end&&(activeType==='all'||s.type===activeType);
    });
    data.push({
      label:`${start.getDate()} ${mois[start.getMonth()]}`,
      dist: Math.round(ws.reduce((a,s)=>a+s.distance,0)*10)/10,
      time: ws.reduce((a,s)=>a+s.duration,0),
    });
  }
  const maxD = Math.max(...data.map(w=>w.dist),1);
  return (
    <div>
      <div className="flex items-end gap-1 h-24">
        {data.map((w,i)=>(
          <div key={i} className="flex-1 flex flex-col items-center group relative">
            {w.dist>0&&(
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {w.dist}km · {fmtDur(w.time)}
              </div>
            )}
            <div className="w-full rounded-t-sm transition-all"
              style={{
                height:`${(w.dist/maxD)*100}%`,
                backgroundColor:activeType!=='all'?sportMeta[activeType]?.color:'#0047AB',
                minHeight:w.dist>0?'4px':'0',
                opacity:0.5+(w.dist/maxD)*0.5,
              }}/>
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {data.map((w,i)=>(
          <div key={i} className="flex-1 text-center">
            {(i===0||i===3||i===6||i===9||i===11)&&<span className="text-[8px] text-gray-400">{w.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Carte activité ── */
function ActivityCard({ session, onSelect, onLike, liked }) {
  const sm = sportMeta[session.type];
  const [localLiked, setLL] = useState(liked);
  const [localLikes, setLK] = useState(session.likes||0);
  const handleLike = e => {
    e.stopPropagation();
    const nl=!localLiked; setLL(nl); setLK(p=>nl?p+1:p-1);
    onLike&&onLike(session.id,nl);
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="flex items-center gap-3 p-4 pb-3">
        <img src={thomas.avatar} alt="" className="w-9 h-9 rounded-full"/>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{thomas.name}</p>
          <p className="text-xs text-gray-400">{fmtDay(session.date)}, {fmtDate(session.date)}</p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{backgroundColor:sm.colorLight,color:sm.color}}>
          {sm.icon} {sm.label}
        </div>
      </div>
      <button onClick={()=>onSelect(session)} className="w-full text-left px-4 pb-3">
        <h3 className="text-base font-bold text-gray-900 hover:text-[#0047AB] transition-colors">{session.title}</h3>
      </button>
      <div className="grid grid-cols-3 border-t border-b border-gray-100 mx-4 py-3 mb-3">
        {[{l:'Distance',v:`${session.distance} km`},{l:'Allure',v:session.pace||'—'},{l:'Temps',v:fmtDur(session.duration)}].map((s,i)=>(
          <div key={i} className={`text-center ${i>0?'border-l border-gray-100':''}`}>
            <p className="text-base font-bold text-gray-800">{s.v}</p>
            <p className="text-xs text-gray-400">{s.l}</p>
          </div>
        ))}
      </div>
      <div onClick={()=>onSelect(session)} className="mx-4 mb-3 h-28 rounded-xl overflow-hidden cursor-pointer relative group" style={{backgroundColor:sm.colorLight}}>
        <svg viewBox="0 0 400 112" className="w-full h-full opacity-40">
          {session.type==='run'     &&<path d="M20,80 C80,20 140,90 200,50 C260,10 320,80 380,55" stroke={sm.color} strokeWidth="3" fill="none" strokeLinecap="round"/>}
          {session.type==='bike'    &&<path d="M20,90 C100,20 180,100 280,40 C340,10 370,60 385,50" stroke={sm.color} strokeWidth="3" fill="none" strokeLinecap="round"/>}
          {session.type==='swim'    &&<path d="M20,56 Q80,20 140,56 Q200,92 260,56 Q320,20 380,56" stroke={sm.color} strokeWidth="3" fill="none" strokeLinecap="round"/>}
          {session.type==='triathlon'&&<path d="M20,80 C120,20 200,90 300,45 C350,20 370,55 385,50" stroke={sm.color} strokeWidth="3" fill="none" strokeLinecap="round"/>}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <span className="text-xs font-semibold text-gray-700 bg-white/90 px-3 py-1.5 rounded-full">Voir le détail</span>
        </div>
        <div className="absolute bottom-2 right-2 text-lg">{feelEmoji[session.feeling]}</div>
      </div>
      <div className="flex items-center gap-1 px-4 pb-4">
        <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${localLiked?'bg-[#0047AB] text-white':'text-gray-500 hover:bg-gray-100'}`}>
          <ThumbsUp size={15}/>{localLikes}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100">
          <MessageCircle size={15}/>Commenter
        </button>
        <div className="flex-1"/>
        <button onClick={()=>onSelect(session)} className="text-xs text-[#0047AB] font-semibold hover:underline">Détails →</button>
      </div>
    </div>
  );
}

/* ── Détail séance ── */
function SessionDetail({ session, onBack }) {
  const sm = sportMeta[session.type];
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(session.likes||0);
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-[#0047AB] font-semibold mb-5 hover:opacity-70">
        <ArrowLeft size={18}/>Retour
      </button>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={thomas.avatar} alt="" className="w-10 h-10 rounded-full"/>
          <div><p className="font-bold text-gray-800">{thomas.name}</p><p className="text-xs text-gray-400">{fmtDay(session.date)}, {fmtDate(session.date)}</p></div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold" style={{backgroundColor:sm.colorLight,color:sm.color}}>{sm.icon} {sm.label}</div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-5">{session.title}</h1>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{l:'Distance',v:`${session.distance} km`},{l:'Temps',v:fmtDur(session.duration)},{l:'Allure',v:session.pace||'—'}].map((s,i)=>(
            <div key={i} className="text-center bg-gray-50 rounded-xl p-3">
              <p className="text-lg font-bold text-gray-800">{s.v}</p><p className="text-xs text-gray-500">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3"><Flame size={18} className="text-red-500"/><div><p className="font-bold">{session.calories} kcal</p><p className="text-xs text-gray-500">Calories</p></div></div>
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3"><Activity size={18} className="text-purple-500"/><div><p className="font-bold">{session.rpe}/10</p><p className="text-xs text-gray-500">Effort ressenti</p></div></div>
        </div>
        <div className="mb-4">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full" style={{width:`${session.rpe*10}%`,backgroundColor:session.rpe>=8?'#ef4444':session.rpe>=6?'#f59e0b':'#10b981'}}/>
          </div>
        </div>
        <div className="h-40 rounded-2xl mb-4 relative overflow-hidden" style={{backgroundColor:sm.colorLight}}>
          <svg viewBox="0 0 600 160" className="w-full h-full opacity-50">
            {session.type==='run'      &&<path d="M30,130 C120,30 200,140 300,70 C390,10 480,120 570,70" stroke={sm.color} strokeWidth="4" fill="none" strokeLinecap="round"/>}
            {session.type==='bike'     &&<path d="M30,140 C150,20 240,150 370,60 C460,10 530,100 575,70" stroke={sm.color} strokeWidth="4" fill="none" strokeLinecap="round"/>}
            {session.type==='swim'     &&<path d="M30,88 Q120,30 210,88 Q300,146 390,88 Q480,30 570,88" stroke={sm.color} strokeWidth="4" fill="none" strokeLinecap="round"/>}
            {session.type==='triathlon'&&<path d="M30,130 C180,20 300,140 430,55 C510,10 555,90 575,70" stroke={sm.color} strokeWidth="4" fill="none" strokeLinecap="round"/>}
          </svg>
          <div className="absolute top-3 left-3 bg-white/90 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700">{sm.icon} Parcours</div>
          <div className="absolute bottom-3 right-3 text-2xl">{feelEmoji[session.feeling]}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
          <span className="font-semibold text-gray-500">Phase : </span>
          <span className="text-gray-800">
            {session.phase===1&&'🟢 Phase 1 — Base'}{session.phase===2&&'🟡 Phase 2 — Construction'}
            {session.phase===3&&'🟠 Phase 3 — Spécifique'}{session.phase===4&&'🔴 Phase 4 — Affûtage'}
          </span>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{session.details}</p>
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <button onClick={()=>{setLiked(!liked);setLikes(l=>liked?l-1:l+1);}} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${liked?'bg-[#0047AB] text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <ThumbsUp size={16}/>{likes} Kudos
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold">
            <MessageCircle size={16}/>Commenter
          </button>
          <button className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold">
            <Share2 size={16}/>Partager
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════ */
export default function ProfilPage() {
  const [showMenu,       setShowMenu]       = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab,      setActiveTab]      = useState('apercu');
  const [chartType,      setChartType]      = useState('all');
  const [selectedSession,setSelectedSession]= useState(null);
  const [likedSessions,  setLikedSessions]  = useState({});

  const counts = useMemo(()=>{
    const c={swim:0,bike:0,run:0,triathlon:0,total:0,dist:0,time:0,cal:0};
    allSessions.forEach(s=>{c[s.type]=(c[s.type]||0)+1;c.total++;c.dist+=s.distance;c.time+=s.duration;c.cal+=s.calories;});
    return c;
  },[]);

  const recentStats = useMemo(()=>{
    const cutoff=new Date('2026-04-05T12:00:00');
    const recent=allSessions.filter(s=>new Date(s.date+'T12:00:00')>=cutoff);
    const byType={};
    recent.forEach(s=>{
      if(!byType[s.type])byType[s.type]={count:0,dist:0,time:0};
      byType[s.type].count++;byType[s.type].dist+=s.distance;byType[s.type].time+=s.duration;
    });
    return {total:recent.length,byType};
  },[]);

  const stats2026 = useMemo(()=>{
    const s=allSessions.filter(s=>s.date.startsWith('2026'));
    return {count:s.length,dist:Math.round(s.reduce((a,x)=>a+x.distance,0)),time:s.reduce((a,x)=>a+x.duration,0)};
  },[]);

  const sortedSessions = useMemo(()=>[...allSessions].reverse(),[]);
  const handleLike=(id,liked)=>setLikedSessions(prev=>({...prev,[id]:liked}));

  /* Icônes pour les badges (emoji selon l'id) */
  const badgeIcon = {
    premier_pas:'👣', force_mental:'🧠', sport_collectif:'🤝',
    coache:'🎯', sans_limite:'🔥', inclusion:'♿',
    discipline:'💪', a_lecoute:'🎧', en_mouvement:'⚡',
    a_lafut:'👁', regulier:'📅', premier_post:'📸',
  };

  if(selectedSession) return (
    <div className="flex h-screen bg-[#f3f6fb] overflow-hidden">
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu}/>
      <MobileMenu showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} showMenu={showMenu} setShowMenu={setShowMenu}/>
      <div className="lg:ml-64 flex-1 flex flex-col w-full">
        <Header setShowMobileMenu={setShowMobileMenu}/>
        <main className="flex-1 overflow-y-auto"><SessionDetail session={selectedSession} onBack={()=>setSelectedSession(null)}/></main>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f3f6fb] overflow-hidden">
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu}/>
      <MobileMenu showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} showMenu={showMenu} setShowMenu={setShowMenu}/>
      <div className="lg:ml-64 flex-1 flex flex-col w-full" onClick={()=>setShowMenu(false)}>
        <Header setShowMobileMenu={setShowMobileMenu}/>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 space-y-5">

            {/* ══════════════════════════════════════════
                BLOC PROFIL — style drawio
            ══════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Ligne principale : avatar + infos + calendrier */}
              <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                {/* ─ Gauche : avatar + nom + stats ─ */}
                <div className="flex-1 p-5">
                  {/* Avatar + nom + modifier */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={thomas.avatar} alt={thomas.name}
                      className="w-16 h-16 rounded-full ring-2 ring-gray-100 shadow bg-gray-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg font-bold text-gray-900 leading-tight">{thomas.name}</h1>
                      <p className="text-sm text-gray-400">{thomas.username}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">{thomas.bio}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <MapPin size={11}/>{thomas.location}
                      </p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
                      <Pencil size={12}/>Modifier
                    </button>
                  </div>

                  {/* 5 stats en ligne */}
                  <div className="grid grid-cols-5 gap-0 border border-gray-100 rounded-xl overflow-hidden">
                    {[
                      {val: counts.total,                          label:'Activités'},
                      {val: `${Math.round(counts.dist)} km`,       label:'KM Total'},
                      {val: `${Math.round(counts.time/60)}h`,      label:'Heures'},
                      {val: thomas.followers,                      label:'Abonnés'},
                      {val: thomas.following,                      label:'Abonnements'},
                    ].map((s,i)=>(
                      <div key={i} className={`text-center py-3 px-1 ${i>0?'border-l border-gray-100':''}`}>
                        <p className="text-base font-black text-gray-900">{s.val}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide leading-tight">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tabs de navigation */}
                  <div className="flex gap-1 mt-4">
                    {[
                      {key:'apercu',    label:'Vue d\'ensemble'},
                      {key:'activites', label:'Activités'},
                      {key:'defis',     label:'Défis'},
                    ].map(t=>(
                      <button key={t.key} onClick={()=>setActiveTab(t.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          activeTab===t.key
                            ? 'bg-[#0047AB] text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─ Droite : calendrier 4 semaines ─ */}
                <div className="lg:w-80 xl:w-96 p-5 bg-gray-50/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">4 dernières semaines</p>
                      <div className="flex items-end gap-2 mt-1">
                        <span className="text-4xl font-black text-gray-900 leading-none">{recentStats.total}</span>
                        <span className="text-xs text-gray-400 pb-1">activités</span>
                      </div>
                    </div>
                    {/* Mini stats par sport */}
                    <div className="flex gap-3">
                      {Object.entries(recentStats.byType).map(([type,stat])=>{
                        const sm=sportMeta[type]; if(!sm) return null;
                        return (
                          <div key={type} className="text-center">
                            <div className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-sm" style={{backgroundColor:sm.colorLight}}>
                              {sm.icon}
                            </div>
                            <p className="text-xs font-black text-gray-800">{stat.count}</p>
                            <p className="text-[10px] font-semibold" style={{color:sm.color}}>{fmtDur(stat.time)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <ActivityCalendar sessions={allSessions}/>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                LAYOUT 2 COLONNES
            ══════════════════════════════════════════ */}
            <div className="flex gap-5 items-start">

              {/* ── Colonne principale ── */}
              <div className="flex-1 min-w-0 space-y-5">

                {/* ─── VUE D'ENSEMBLE ─── */}
                {activeTab==='apercu'&&(
                  <>
                    {/* Finisher */}
                    <div className="bg-gradient-to-r from-purple-600 to-[#FFA75F] rounded-2xl p-5 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">🏅</span>
                        <div className="flex-1">
                          <p className="font-black text-lg">TRIATHLON M — FINISHER</p>
                          <p className="text-white/70 text-sm">3 Mai 2026 · 312e / 520 partants</p>
                        </div>
                        <div className="text-right"><p className="text-2xl font-black">2h52'40</p><p className="text-white/60 text-xs">Temps total</p></div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs">
                        {[{l:'🏊 Nata.',v:'28:40'},{l:'T1',v:'3:00'},{l:'🚴 Vélo',v:'1:18:00'},{l:'T2',v:'2:00'},{l:'🏃 Course',v:'1:01:00'}].map((x,i)=>(
                          <div key={i} className="bg-white/15 rounded-xl p-2 text-center"><p className="font-bold">{x.l}</p><p className="text-sm font-black">{x.v}</p></div>
                        ))}
                      </div>
                    </div>

                    {/* Performances */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">🏆 Performances</h2>
                      <div className="space-y-3">
                        {[
                          {icon:'🥇',label:'10 KM record',    val:'1h02:00',sub:'Allure 6:12/km · 19 avr. 2026',color:'#10b981'},
                          {icon:'🏊',label:'1500m nata. record',val:'28min40',sub:'Eau libre · 3 mai 2026',color:'#06b6d4'},
                          {icon:'🚴',label:'Vélo record distance',val:'48 km',sub:'2h20 · 13 avr. 2026',color:'#f59e0b'},
                        ].map((p,i)=>(
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                            <span className="text-2xl">{p.icon}</span>
                            <div className="flex-1"><p className="text-sm font-bold text-gray-800">{p.label}</p><p className="text-xs text-gray-400">{p.sub}</p></div>
                            <p className="font-black text-lg" style={{color:p.color}}>{p.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Graphique */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2"><BarChart3 size={18} className="text-[#0047AB]"/>Distance par semaine</h2>
                        <div className="flex gap-1">
                          {[{key:'all',label:'Tout'},{key:'run',label:'🏃'},{key:'bike',label:'🚴'},{key:'swim',label:'🏊'}].map(t=>(
                            <button key={t.key} onClick={()=>setChartType(t.key)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${chartType===t.key?'bg-[#0047AB] text-white':'text-gray-500 hover:bg-gray-100'}`}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <WeeklyChart sessions={allSessions} activeType={chartType}/>
                    </div>

                    {/* Activités récentes */}
                    <div>
                      <h2 className="font-bold text-gray-900 mb-3">Activités récentes</h2>
                      <div className="space-y-4">
                        {sortedSessions.slice(0,5).map(s=>(
                          <ActivityCard key={s.id} session={s} onSelect={setSelectedSession} onLike={handleLike} liked={likedSessions[s.id]||false}/>
                        ))}
                        <button onClick={()=>setActiveTab('activites')} className="w-full py-3 text-sm font-semibold text-[#0047AB] border border-[#0047AB]/20 rounded-2xl hover:bg-[#0047AB]/5 transition-colors">
                          Voir toutes les activités ({counts.total}) →
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ─── ACTIVITÉS ─── */}
                {activeTab==='activites'&&(
                  <div className="space-y-4">
                    {sortedSessions.map(s=>(
                      <ActivityCard key={s.id} session={s} onSelect={setSelectedSession} onLike={handleLike} liked={likedSessions[s.id]||false}/>
                    ))}
                  </div>
                )}

                {/* ─── DÉFIS ─── */}
                {activeTab==='defis'&&(
                  <div className="space-y-5">
                    {/* Challenge en cours */}
                    <div className="bg-gradient-to-br from-[#0047AB] to-[#003080] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Target size={16} className="opacity-60"/>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Défi en cours</p>
                      </div>
                      <h2 className="text-2xl font-black mb-1">Triathlon M</h2>
                      <p className="text-white/60 text-sm mb-5">3 Mai 2026 · Toulouse · 1.5km nata · 40km vélo · 10km course</p>

                      {/* Progression des 3 disciplines */}
                      <div className="space-y-3">
                        {[
                          {sport:'swim', label:'Natation', target:'1 500 m', done:'1 500 m ✅', pct:100, color:'#06b6d4'},
                          {sport:'bike', label:'Vélo',     target:'40 km',   done:'40 km ✅',   pct:100, color:'#f59e0b'},
                          {sport:'run',  label:'Course',   target:'10 km',   done:'10 km ✅',   pct:100, color:'#10b981'},
                        ].map((d,i)=>(
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-semibold">{sportMeta[d.sport].icon} {d.label}</span>
                              <span className="text-white/70">{d.done} / {d.target}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div className="h-2 rounded-full transition-all" style={{width:`${d.pct}%`,backgroundColor:d.color}}/>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-[#FFA75F]"/>
                        <span className="font-black text-[#FFA75F] text-lg">DÉFI COMPLÉTÉ — FINISHER 🏅</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-gray-900">🏅 Badges</h2>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-semibold">
                          {badges.filter(b=>b.unlocked).length} / {badges.length} débloqués
                        </span>
                      </div>

                      {/* Badges débloqués */}
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Débloqués</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                        {badges.filter(b=>b.unlocked).map(b=>(
                          <div key={b.id} className="flex flex-col items-center p-3 rounded-2xl bg-gray-900 hover:bg-gray-800 transition-all cursor-pointer group">
                            <BadgeShape color={b.color} icon={badgeIcon[b.id]} size={52}/>
                            <p className="text-xs font-bold text-white text-center mt-2 leading-tight">{b.label}</p>
                            <p className="text-[10px] text-gray-400 text-center mt-0.5 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">{b.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Badges verrouillés */}
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Verrouillés</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {badges.filter(b=>!b.unlocked).map(b=>(
                          <div key={b.id} className="flex flex-col items-center p-3 rounded-2xl bg-gray-900/60 border border-gray-700/30 relative group cursor-pointer">
                            <div className="relative">
                              <BadgeShape color={b.color} icon={badgeIcon[b.id]} size={52} locked={true}/>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                                <Lock size={10} className="text-gray-400"/>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-gray-500 text-center mt-2 leading-tight">{b.label}</p>
                            <p className="text-[10px] text-gray-600 text-center mt-0.5 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">{b.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Colonne droite ── */}
              <div className="w-64 xl:w-72 shrink-0 hidden lg:flex flex-col gap-4">

                {/* Mes stats */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex gap-1 mb-2">{['🏃','🚴','🏊','🏁'].map((ic,i)=><span key={i}>{ic}</span>)}</div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Mes statistiques</h3>

                  <p className="text-xs font-bold text-gray-500 mb-2">4 dernières semaines</p>
                  {[
                    {l:'Activités/semaine', v:`${(recentStats.total/4).toFixed(1)}`},
                    {l:'Distance moy./sem.',v:`${Math.round(Object.values(recentStats.byType).reduce((a,b)=>a+b.dist,0)/4)} km`},
                    {l:'Durée moy./sem.',   v:fmtDur(Math.round(Object.values(recentStats.byType).reduce((a,b)=>a+b.time,0)/4))},
                  ].map((s,i)=>(
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-gray-500">{s.l}</span><span className="font-bold text-gray-800">{s.v}</span>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <p className="text-xs font-bold text-gray-500 mb-2">2026</p>
                    {[
                      {l:'Activités',v:stats2026.count},
                      {l:'Distance', v:`${stats2026.dist} km`},
                      {l:'Temps',    v:fmtDur(stats2026.time)},
                      {l:'Dénivelé', v:'289 m'},
                    ].map((s,i)=>(
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500">{s.l}</span><span className="font-bold text-gray-800">{s.v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <p className="text-xs font-bold text-gray-500 mb-2">De tout temps</p>
                    {[
                      {l:'Activités',v:counts.total},
                      {l:'Distance', v:`${Math.round(counts.dist)} km`},
                      {l:'Temps',    v:fmtDur(counts.time)},
                    ].map((s,i)=>(
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500">{s.l}</span><span className="font-bold text-gray-800">{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meilleurs efforts */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Meilleurs efforts</h3>
                  {[
                    {l:'400m nata.',    v:'1:48',    c:'#06b6d4'},
                    {l:'1km course',   v:'5:12',    c:'#10b981'},
                    {l:'5km',          v:'31:20',   c:'#10b981'},
                    {l:'10km',         v:'1:02:00', c:'#10b981'},
                    {l:'1500m nata.',  v:'28:40',   c:'#06b6d4'},
                    {l:'40km vélo',    v:'1:18:00', c:'#f59e0b'},
                  ].map((e,i)=>(
                    <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{e.l}</span>
                      <span className="font-bold" style={{color:e.c}}>{e.v}</span>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Social</h3>
                  <div className="flex gap-6">
                    <div><p className="text-xl font-black text-gray-800">{thomas.following}</p><p className="text-xs text-gray-400">Abonnements</p></div>
                    <div><p className="text-xl font-black text-gray-800">{thomas.followers}</p><p className="text-xs text-gray-400">Abonnés</p></div>
                  </div>
                </div>

                {/* Objectif */}
                <div className="bg-gradient-to-br from-[#0047AB] to-[#003080] rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={15}/><p className="text-xs font-semibold uppercase tracking-wider opacity-60">Objectif</p>
                  </div>
                  <p className="font-black text-lg">Triathlon M</p>
                  <p className="text-white/60 text-xs mb-3">3 Mai 2026 · Toulouse</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#FFA75F]"/>
                    <span className="font-bold text-[#FFA75F]">COMPLÉTÉ !</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}