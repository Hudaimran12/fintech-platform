import React from 'react';
import { Link } from 'react-router-dom';
import RecommendationList from '../components/RecommendationList';
import { useUserProfile } from '../context/UserProfileContext';
import { useProducts } from '../hooks/useProducts';
import './Recommendations.css';

export default function Recommendations() {
  const { profile, isProfileComplete, getProductRecommendations } = useUserProfile();
  const { products, loading } = useProducts();

  const recommendations = isProfileComplete() ? getProductRecommendations(products) : [];

  if (!isProfileComplete()) {
    return (
      <div className="page-wrapper">
        <div className="container recs-container">
          <div className="empty-state" style={{ marginTop: '4rem' }}>
            <div className="empty-icon">🧭</div>
            <h3>No Profile Yet</h3>
            <p>You need to complete your financial profile before we can generate personalised recommendations.</p>
            <Link to="/profile" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              Create My Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container recs-container">
        <div className="recs-header">
          <div>
            <h1>Your Recommendations</h1>
            <p>Products curated dynamically based on your risk profile, horizon, and budget.</p>
          </div>
          <Link to="/profile" className="btn btn-secondary">Edit Profile</Link>
        </div>

        {loading ? (
          <div className="loading-center"><div className="loading-spinner" /><p>Generating recommendations…</p></div>
        ) : (
          <RecommendationList recommendations={recommendations} profile={profile} />
        )}
      </div>
    </div>
  );
}
