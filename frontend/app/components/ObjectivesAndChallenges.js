'use client';

export default function ObjectivesAndChallenges({ objectives, challenges }) {
  return (
    <div>
      {objectives && objectives.length > 0 && (
        <div className="obj-section">
          <h3 className="card-title"><span className="title-icon">🎯</span> Objectifs</h3>
          <div className="obj-list">
            {objectives.map((obj, i) => (
              <div className="obj-item" key={i}>
                <p className="obj-label">{obj.label}</p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${obj.pct}%` }} />
                </div>
                <span className="challenge-pct">{obj.pct} %</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {challenges && challenges.length > 0 && (
        <div className="obj-section" style={{ marginTop: '16px' }}>
          <h3 className="card-title"><span className="title-icon">⚡</span> Défis actifs</h3>
          <div className="obj-list">
            {challenges.map((c, i) => (
              <div className="obj-item" key={i}>
                <p className="obj-label">{c.icon} {c.name}</p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${c.pct}%` }} />
                </div>
                <span className="challenge-pct">{c.pct} %</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
