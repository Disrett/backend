'use client';

import { MapPin, Edit3, UserPlus } from 'lucide-react';

export default function ProfileHeader({ user, isOwnProfile }) {
  return (
    <div className="profile-header">
      <div className="profile-header-top">
        <img
          src={user.avatar}
          alt={user.name}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-username">{user.username}</p>
          <p className="profile-bio">{user.bio}</p>
          {user.location && (
            <p className="profile-location">
              <MapPin size={14} />
              {user.location}
            </p>
          )}
        </div>
        <div className="profile-actions">
          {isOwnProfile ? (
            <button className="btn-edit">
              <Edit3 size={16} />
              Modifier
            </button>
          ) : (
            <button className="btn-follow">
              <UserPlus size={16} />
              Suivre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
