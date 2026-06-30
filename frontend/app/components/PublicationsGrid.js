'use client';

import { Heart, MessageCircle } from 'lucide-react';

export default function PublicationsGrid({ publications }) {
  return (
    <div className="publications-grid">
      {publications.map((pub) => (
        <div className="publication-card" key={pub.id}>
          <div className="publication-img-wrap">
            <img src={pub.image} alt={pub.title} className="publication-img" />
            <div className="publication-overlay">
              <span className="pub-stat"><Heart size={14} /> {pub.likes}</span>
              <span className="pub-stat"><MessageCircle size={14} /> {pub.comments}</span>
            </div>
          </div>
          <div className="publication-meta">
            <p className="publication-title">{pub.title}</p>
            <span className="publication-time">{pub.timeAgo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
