import React from 'react';
import ProductCard from './ProductCard';
import './RecommendationList.css';

export default function RecommendationList({ recommendations, profile }) {
  if (!profile || !profile.riskTolerance) return null;

  return (
    <div className="rec-list">
      <div className="rec-meta">
        <span className="rec-count">{recommendations.length} products match your profile</span>
        <span className="rec-profile-pill">
          {profile.riskTolerance} · {profile.investmentHorizon} · {profile.investmentGoal}
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No Matching Products</h3>
          <p>Try adjusting your profile — increase monthly capacity or broaden risk tolerance.</p>
        </div>
      ) : (
        <div className="rec-grid">
          {recommendations.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
