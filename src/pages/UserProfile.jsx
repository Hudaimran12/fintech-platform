import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import { useUserProfile } from '../context/UserProfileContext';
import { useProducts } from '../hooks/useProducts';
import './UserProfile.css';

const RISK_LABELS = { conservative: '🛡️ Conservative', moderate: '⚖️ Moderate', aggressive: '🚀 Aggressive' };
const HORIZON_LABELS = { short: '⚡ Short (1–2yr)', medium: '📅 Medium (3–5yr)', long: '🌱 Long (5+yr)' };

export default function UserProfile() {
  const { profile, isProfileComplete, resetProfile } = useUserProfile();
  const { products } = useProducts();
  const navigate = useNavigate();
  const complete = isProfileComplete();

  // Preview: how many products match
  const matchCount = complete
    ? products.filter(p =>
        p.minInvestment <= (Number(profile.monthlyCapacity) || Infinity) &&
        ({ conservative: ['low'], moderate: ['low','medium'], aggressive: ['low','medium','high'] }[profile.riskTolerance] || []).includes(p.riskLevel)
      ).length
    : 0;

  return (
    <div className="page-wrapper">
      <div className="container up-container">
        <div className="up-header">
          <h1>My Financial Profile</h1>
          <p>Your profile drives personalised product recommendations. All fields are required.</p>
        </div>

        <div className="up-layout">
          <div className="up-form-wrap card">
            <ProfileForm onSaved={() => {}} />
          </div>

          <aside className="up-sidebar">
            {complete ? (
              <div className="card profile-summary-card animate-fade">
                <h3 style={{ marginBottom: '1rem' }}>Your Profile</h3>
                <div className="ps-row"><span className="ps-key">Risk</span><span className="ps-val">{RISK_LABELS[profile.riskTolerance]}</span></div>
                <div className="ps-row"><span className="ps-key">Horizon</span><span className="ps-val">{HORIZON_LABELS[profile.investmentHorizon]}</span></div>
                <div className="ps-row"><span className="ps-key">Monthly</span><span className="ps-val">₨ {Number(profile.monthlyCapacity).toLocaleString()}</span></div>
                <div className="ps-row"><span className="ps-key">Liquidity</span><span className="ps-val" style={{ textTransform: 'capitalize' }}>{profile.liquidityPreference}</span></div>
                <div className="ps-row"><span className="ps-key">Goal</span><span className="ps-val">{profile.investmentGoal}</span></div>

                <hr className="divider" />

                <div className="match-preview">
                  <span className="match-number">{matchCount}</span>
                  <span className="match-label">products match your profile</span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                  onClick={() => navigate('/recommendations')}>
                  View Recommendations →
                </button>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  onClick={resetProfile}>
                  Reset Profile
                </button>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
                <h3 style={{ marginBottom: '0.5rem' }}>Complete Your Profile</h3>
                <p style={{ fontSize: '0.875rem' }}>Fill all fields to unlock personalised recommendations.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
