import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import './Home.css';

const CATEGORIES = [
  { id: 'savings',    label: 'Savings',    icon: '🏦', desc: 'Low-risk, stable returns',   color: 'var(--color-savings)' },
  { id: 'investment', label: 'Investments', icon: '📈', desc: 'Diversified equity funds',    color: 'var(--color-investment)' },
  { id: 'insurance',  label: 'Insurance',   icon: '🛡️', desc: 'Protect and grow wealth',    color: 'var(--color-insurance)' },
  { id: 'crypto',     label: 'Crypto',      icon: '₿',  desc: 'High-risk digital assets',   color: 'var(--color-crypto)' },
];

export default function Home() {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  // Dynamically select featured: best return per category
  const featured = useMemo(() => {
    const byCategory = {};
    products.forEach(p => {
      if (!byCategory[p.category] || p.expectedReturn > byCategory[p.category].expectedReturn) {
        byCategory[p.category] = p;
      }
    });
    return Object.values(byCategory).slice(0, 4);
  }, [products]);

  const stats = [
    { label: 'Financial Products', value: products.length || '20+' },
    { label: 'Product Categories', value: 4 },
    { label: 'Avg. Max Return', value: products.length ? `${Math.max(...products.map(p => p.expectedReturn)).toFixed(1)}%` : '28%' },
    { label: 'Min. Investment', value: '₨ 5K' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text animate-fade">
            <span className="hero-pill">🇵🇰 Built for Pakistani Investors</span>
            <h1>Discover Financial Products <span className="gradient-text">Tailored to You</span></h1>
            <p className="hero-desc">
              FinVest analyses your risk profile, investment horizon, and liquidity preferences
              to surface financial instruments — savings accounts, funds, insurance, and crypto — that match your goals.
            </p>
            <div className="hero-actions">
              <Link to="/profile" className="btn btn-primary btn-lg">Create My Profile →</Link>
              <Link to="/products" className="btn btn-secondary btn-lg">Browse All Products</Link>
            </div>
          </div>
          <div className="hero-visual animate-fade">
            <div className="floating-card fc1 card">
              <span style={{ fontSize: '1.5rem' }}>📈</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#22c55e' }}>28.5%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Best Return p.a.</div>
              </div>
            </div>
            <div className="floating-card fc2 card">
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Risk-Matched</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Recommendations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-row">
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Nav */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Each category has distinct risk-return characteristics</p>
            </div>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className="cat-card card card-hover"
                onClick={() => navigate(`/products?category=${cat.id}`)}
              >
                <div className="cat-icon" style={{ background: `${cat.color}18`, color: cat.color }}>
                  {cat.icon}
                </div>
                <div className="cat-label">{cat.label}</div>
                <div className="cat-desc">{cat.desc}</div>
                <div className="cat-arrow" style={{ color: cat.color }}>→</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Top performer from each category</p>
            </div>
            <Link to="/products" className="btn btn-ghost">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /><p>Loading products…</p></div>
          ) : (
            <div className="featured-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card card">
            <h2>Get Personalised Recommendations</h2>
            <p>Answer 5 quick questions about your financial goals and risk appetite. Our engine will surface the most suitable products.</p>
            <Link to="/profile" className="btn btn-primary btn-lg">Build My Financial Profile →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
