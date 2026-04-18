import React from "react";
import ProductCard from "./ProductCard";

/**
 * RecommendationList — displays recommended products based on user profile
 * Props: recommendations (array), profile (object)
 */
export default function RecommendationList({ recommendations, profile }) {
  if (!profile || !profile.riskTolerance) return null;

  return (
    <div>
      <div className="rec-meta">
        Showing <strong>{recommendations.length}</strong> products matched to your profile:
        <span className="rec-tag">{profile.riskTolerance}</span>
        <span className="rec-tag">{profile.investmentHorizon}-term</span>
        <span className="rec-tag">{profile.liquidityPreference} liquidity</span>
      </div>

      {recommendations.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>◎</div>
          <h3>No Products Match Your Profile</h3>
          <p style={{ marginTop: "0.5rem" }}>
            Try increasing your monthly capacity or adjusting your risk tolerance.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {recommendations.map((p, i) => (
            <ProductCard key={p.id} product={p} animDelay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}
