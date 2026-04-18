import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { usePortfolio } from "../context/PortfolioContext";
import { useUserProfile } from "../context/UserProfileContext";
import RiskBadge from "../components/RiskBadge";
import ReturnDisplay from "../components/ReturnDisplay";
import { formatPKR } from "../utils/finance";
import "./Home.css";

const CATEGORIES = [
  { key: "savings",    label: "Savings",    icon: "🏦", desc: "Safe, liquid, predictable" },
  { key: "investment", label: "Investment", icon: "📈", desc: "Growth-focused funds" },
  { key: "insurance",  label: "Insurance",  icon: "🛡️", desc: "Protection + returns" },
  { key: "crypto",     label: "Crypto",     icon: "₿",  desc: "High risk, high reward" },
];

export default function Home() {
  const { products, loading } = useProducts();
  const { items } = usePortfolio();
  const { isProfileComplete } = useUserProfile();
  const navigate = useNavigate();

  // Featured: pick highest return from each category (dynamic, not hardcoded)
  const featured = useMemo(() => {
    const result = [];
    CATEGORIES.forEach(({ key }) => {
      const catProducts = products.filter(p => p.category === key);
      if (catProducts.length > 0) {
        const best = catProducts.reduce((a, b) =>
          b.expectedReturn > a.expectedReturn ? b : a
        );
        result.push(best);
      }
    });
    return result.slice(0, 4);
  }, [products]);

  const stats = useMemo(() => ({
    total: products.length,
    categories: 4,
    avgReturn: products.length
      ? (products.reduce((s, p) => s + p.expectedReturn, 0) / products.length).toFixed(1)
      : 0,
    portfolioItems: items.length,
  }), [products, items]);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">BS FinTech — FAST University</div>
          <h1>Discover Financial<br /><em>Products Built for You</em></h1>
          <p className="hero-desc">
            FinVest matches your risk tolerance, investment horizon, and goals
            to the right financial instruments — from savings to crypto.
          </p>
          <div className="hero-actions">
            {isProfileComplete() ? (
              <Link to="/recommendations" className="btn btn-copper btn-lg">
                View My Recommendations →
              </Link>
            ) : (
              <Link to="/profile" className="btn btn-copper btn-lg">
                Create Your Financial Profile →
              </Link>
            )}
            <Link to="/products" className="btn btn-outline btn-lg">
              Browse All Products
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hc-label">Portfolio Return</div>
            <div className="hc-value">+12.4%</div>
            <div className="hc-bar"><div className="hc-fill" /></div>
            <div className="hc-meta">Weighted annual return</div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="hc-label">Risk Level</div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <RiskBadge riskLevel="low" />
              <RiskBadge riskLevel="medium" />
              <RiskBadge riskLevel="high" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div className="container">
        <div className="stat-bar" style={{ marginBottom: "2.5rem" }}>
          <div className="stat-item">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{stats.categories}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg. Return</span>
            <span className="stat-value" style={{ color: "var(--copper)" }}>{stats.avgReturn}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">In Your Portfolio</span>
            <span className="stat-value">{stats.portfolioItems}</span>
          </div>
        </div>

        {/* Category navigation */}
        <section className="home-section">
          <h2>Browse by Category</h2>
          <p style={{ marginBottom: "1.5rem" }}>Click a category to filter products instantly.</p>
          <div className="grid-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className="cat-card"
                onClick={() => navigate(`/products?category=${cat.key}`)}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-label">{cat.label}</div>
                <div className="cat-desc">{cat.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="home-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
            <div>
              <h2>Featured Products</h2>
              <p>Best performer from each category — updated dynamically.</p>
            </div>
            <Link to="/products" className="btn btn-ghost btn-sm">View All →</Link>
          </div>

          {loading ? (
            <div className="grid-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
              ))}
            </div>
          ) : (
            <div className="grid-4">
              {featured.map((p, i) => (
                <Link to={`/product/${p.id}`} key={p.id} className="featured-card anim-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="fc-top">
                    <span className={`badge badge-${p.category}`}>{p.category}</span>
                    <RiskBadge riskLevel={p.riskLevel} size="sm" />
                  </div>
                  <img src={p.image} alt={p.name} className="fc-img" />
                  <div className="fc-name">{p.name}</div>
                  <div className="fc-return"><ReturnDisplay value={p.expectedReturn} showTrend /></div>
                  <div className="fc-min">Min: {formatPKR(p.minInvestment)}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        {!isProfileComplete() && (
          <section className="home-cta">
            <h2>Get Personalized Recommendations</h2>
            <p>Tell us your risk tolerance, investment goals, and monthly capacity — we'll match you to the right products.</p>
            <Link to="/profile" className="btn btn-copper btn-lg">
              Create Financial Profile →
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
