import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserProfile } from "../context/UserProfileContext";
import { useProducts } from "../hooks/useProducts";
import ProfileForm from "../components/ProfileForm";
import "./UserProfile.css";

const LABELS = {
  riskTolerance: {
    conservative: { text: "Conservative", icon: "🛡️", color: "var(--green)",  desc: "Low-risk products only" },
    moderate:     { text: "Moderate",     icon: "⚖️", color: "var(--amber)",  desc: "Low & medium risk products" },
    aggressive:   { text: "Aggressive",   icon: "🚀", color: "var(--red)",    desc: "All risk levels included" },
  },
  investmentHorizon: {
    short:  { text: "Short-term",  icon: "⏱️", desc: "1–2 years" },
    medium: { text: "Medium-term", icon: "📅", desc: "3–5 years" },
    long:   { text: "Long-term",   icon: "🗓️", desc: "5+ years" },
  },
  liquidityPreference: {
    easy:     { text: "Quick Access",     icon: "💧", desc: "Fully liquid products only" },
    moderate: { text: "Some Flexibility", icon: "🌊", desc: "Easy + moderate liquidity" },
    locked:   { text: "Can Lock Funds",   icon: "🔒", desc: "All liquidity types" },
  },
};

export default function UserProfile() {
  const { profile, updateProfile, isProfileComplete, getProductRecommendations } = useUserProfile();
  const { products } = useProducts();
  const [editing, setEditing] = useState(!isProfileComplete());
  const [saved, setSaved] = useState(false);

  const matchCount = isProfileComplete()
    ? getProductRecommendations(products).length
    : 0;

  function handleSubmit(newProfile) {
    updateProfile(newProfile);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Financial <span style={{ color: "var(--copper)" }}>Profile</span></h1>
        <p>Your profile drives personalized recommendations. Configure all 5 dimensions.</p>
      </div>

      {saved && (
        <div className="profile-saved-banner anim-slide-up">
          ✓ Profile saved! <strong>{matchCount} products</strong> match your preferences.
          <Link to="/recommendations" style={{ marginLeft: "1rem", color: "var(--green)", fontWeight: 700 }}>
            View Recommendations →
          </Link>
        </div>
      )}

      <div className="up-layout">
        <div>
          {!editing && isProfileComplete() ? (
            <div>
              {/* Summary card */}
              <div className="card" style={{ marginBottom: "1.25rem" }}>
                <div className="up-summary-header">
                  <h2 style={{ fontSize: "1.1rem" }}>Your Current Preferences</h2>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                    ✏️ Change Preferences
                  </button>
                </div>

                {/* Risk Tolerance */}
                <div className="pref-block">
                  <div className="pref-label">Risk Tolerance</div>
                  <div className="pref-value-row">
                    <span className="pref-icon">{LABELS.riskTolerance[profile.riskTolerance]?.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div className="pref-value" style={{ color: LABELS.riskTolerance[profile.riskTolerance]?.color }}>
                        {LABELS.riskTolerance[profile.riskTolerance]?.text}
                      </div>
                      <div className="pref-desc">{LABELS.riskTolerance[profile.riskTolerance]?.desc}</div>
                    </div>
                  </div>
                  <div className="risk-pips">
                    {[
                      { key: "conservative", color: "var(--green)" },
                      { key: "moderate",     color: "var(--amber)" },
                      { key: "aggressive",   color: "var(--red)"   },
                    ].map(({ key, color }) => (
                      <div
                        key={key}
                        className="risk-pip"
                        style={{ background: profile.riskTolerance === key ? color : "var(--bg3)" }}
                        title={key}
                      />
                    ))}
                    <span style={{ fontSize: "0.72rem", color: "var(--ink3)", marginLeft: "0.4rem" }}>
                      {profile.riskTolerance}
                    </span>
                  </div>
                </div>

                <hr className="divider" />

                {/* Horizon */}
                <div className="pref-block">
                  <div className="pref-label">Investment Horizon</div>
                  <div className="pref-value-row">
                    <span className="pref-icon">{LABELS.investmentHorizon[profile.investmentHorizon]?.icon}</span>
                    <div>
                      <div className="pref-value">{LABELS.investmentHorizon[profile.investmentHorizon]?.text}</div>
                      <div className="pref-desc">{LABELS.investmentHorizon[profile.investmentHorizon]?.desc}</div>
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                {/* Monthly capacity */}
                <div className="pref-block">
                  <div className="pref-label">Monthly Investment Capacity</div>
                  <div className="pref-value-row">
                    <span className="pref-icon">💰</span>
                    <div>
                      <div className="pref-value" style={{ color: "var(--copper)" }}>
                        PKR {Number(profile.monthlyCapacity).toLocaleString("en-PK")}
                        <span style={{ fontSize: "0.78rem", fontWeight: 400, color: "var(--ink3)" }}> / month</span>
                      </div>
                      <div className="pref-desc">Only products with min. investment ≤ this are shown</div>
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                {/* Liquidity */}
                <div className="pref-block">
                  <div className="pref-label">Liquidity Preference</div>
                  <div className="pref-value-row">
                    <span className="pref-icon">{LABELS.liquidityPreference[profile.liquidityPreference]?.icon}</span>
                    <div>
                      <div className="pref-value">{LABELS.liquidityPreference[profile.liquidityPreference]?.text}</div>
                      <div className="pref-desc">{LABELS.liquidityPreference[profile.liquidityPreference]?.desc}</div>
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                {/* Goal */}
                <div className="pref-block">
                  <div className="pref-label">Investment Goal</div>
                  <div className="pref-value-row">
                    <span className="pref-icon">🎯</span>
                    <div>
                      <div className="pref-value">{profile.investmentGoal}</div>
                      <div className="pref-desc">Primary financial objective</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match count */}
              <div className="card match-count-card">
                <div className="mc-number">{matchCount}</div>
                <div className="mc-label">products match your current profile</div>
                <div className="mc-actions">
                  <Link to="/recommendations" className="btn btn-copper" style={{ flex: 1, justifyContent: "center" }}>
                    View My Recommendations →
                  </Link>
                  <Link to="/products" className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }}>
                    Browse All Products
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Edit form */
            <div className="card">
              {isProfileComplete() && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                  <h3>Update Your Preferences</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>✕ Cancel</button>
                </div>
              )}
              <ProfileForm profile={profile} onSubmit={handleSubmit} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <h3 style={{ marginBottom: "1rem" }}>How Filtering Works</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                { icon: "🛡️", title: "Risk Tolerance",    desc: "Conservative → low only. Moderate → low+medium. Aggressive → all risks." },
                { icon: "⏱️", title: "Horizon Matching",  desc: "Short horizon → short products. Long horizon unlocks all time horizons." },
                { icon: "💧", title: "Liquidity Filter",  desc: "Easy preference → liquid only. Locked preference → all liquidity types." },
                { icon: "💰", title: "Budget Filter",     desc: "Products shown only if min. investment ≤ your monthly capacity." },
              ].map((item) => (
                <div key={item.title} style={{ display: "flex", gap: "0.6rem" }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink3)", lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isProfileComplete() && !editing && (
            <div className="card" style={{ background: "var(--green-bg)", border: "1px solid rgba(45,106,79,0.2)" }}>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <span style={{ fontSize: "1.3rem" }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--green)" }}>Profile Complete</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink3)" }}>All 5 dimensions configured</div>
                </div>
              </div>
            </div>
          )}

          <div className="card" style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.78rem", color: "var(--ink3)" }}>
              <span>💾</span>
              <span>Profile is saved in <strong>localStorage</strong> — survives page refresh.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
