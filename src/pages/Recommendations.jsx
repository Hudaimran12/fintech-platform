import React from "react";
import { Link } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import { useProducts } from "../hooks/useProducts";
import RecommendationList from "../components/RecommendationList";
import "../components/RecommendationList.css";

export default function Recommendations() {
  const { profile, isProfileComplete, getProductRecommendations } = useUserProfile();
  const { products, loading } = useProducts();

  if (!isProfileComplete()) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
        <h2>Profile Required</h2>
        <p style={{ margin: "0.5rem 0 2rem" }}>
          Create your financial profile first to get personalized product recommendations.
        </p>
        <Link to="/profile" className="btn btn-copper btn-lg">Create Profile →</Link>
      </div>
    );
  }

  const recommendations = getProductRecommendations(products);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your <span style={{ color: "var(--copper)" }}>Recommendations</span></h1>
        <p>Personalized financial products based on your risk profile, horizon, and capacity.</p>
      </div>

      {/* Profile summary strip */}
      <div className="card" style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem", padding: "1rem 1.5rem" }}>
        {[
          ["Risk",      profile.riskTolerance],
          ["Horizon",   profile.investmentHorizon],
          ["Capacity",  `PKR ${Number(profile.monthlyCapacity).toLocaleString()}/mo`],
          ["Liquidity", profile.liquidityPreference],
          ["Goal",      profile.investmentGoal],
        ].map(([label, val]) => (
          <div key={label} className="stat-item" style={{ border: "none", padding: 0, minWidth: 0 }}>
            <span className="stat-label" style={{ fontSize: "0.68rem" }}>{label}</span>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--ink)", textTransform: "capitalize" }}>{val}</span>
          </div>
        ))}
        <Link to="/profile" className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", alignSelf: "center" }}>Edit →</Link>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <RecommendationList recommendations={recommendations} profile={profile} />
      )}
    </div>
  );
}
