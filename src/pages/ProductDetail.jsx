import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { usePortfolio } from "../context/PortfolioContext";
import RiskBadge from "../components/RiskBadge";
import ReturnDisplay from "../components/ReturnDisplay";
import {
  generateDecisionInsight,
  calculateProjectedReturn,
  formatPKR,
} from "../utils/finance";
import "./ProductDetail.css";

const ATTR_LABELS = {
  liquidity:   { easy: "Easy Access", moderate: "Moderate", locked: "Locked" },
  timeHorizon: { short: "Short-term (1–2 yrs)", medium: "Mid-term (3–5 yrs)", long: "Long-term (5+ yrs)" },
  category:    { savings: "Savings Account", investment: "Investment Fund", insurance: "Insurance Plan", crypto: "Crypto Asset" },
};

const RISK_WEIGHT = { low: 30, medium: 60, high: 90 };

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToPortfolio, isInPortfolio } = usePortfolio();

  const [investAmount, setInvestAmount] = useState("");
  const [compareId, setCompareId] = useState("");
  const [added, setAdded] = useState(false);

  const product = useMemo(
    () => products.find(p => String(p.id) === String(id)),
    [products, id]
  );

  const compareProduct = useMemo(
    () => products.find(p => String(p.id) === String(compareId)),
    [products, compareId]
  );

  const insights = useMemo(
    () => (product ? generateDecisionInsight(product) : []),
    [product]
  );

  const projections = useMemo(() => {
    const amt = parseFloat(investAmount);
    if (!product || !amt || amt <= 0) return [];
    return calculateProjectedReturn(amt, product.expectedReturn, 5);
  }, [investAmount, product]);

  function handleAdd() {
    if (!product || isInPortfolio(product.id)) return;
    addToPortfolio(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <div style={{ fontSize: "3rem" }}>◎</div>
        <h2 style={{ margin: "1rem 0 0.5rem" }}>Product Not Found</h2>
        <p>No product with ID "{id}" exists.</p>
        <Link to="/products" className="btn btn-outline" style={{ marginTop: "1.5rem" }}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  const inPortfolio = isInPortfolio(product.id);
  const riskPct = RISK_WEIGHT[product.riskLevel];

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Back
      </button>

      <div className="pd-layout">
        {/* Left: main info */}
        <div>
          {/* Header card */}
          <div className="card pd-header-card">
            <img src={product.image} alt={product.name} className="pd-img" />
            <div className="pd-header-info">
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <span className={`badge badge-${product.category}`}>{product.category}</span>
                <RiskBadge riskLevel={product.riskLevel} />
              </div>
              <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{product.name}</h1>
              <div style={{ marginBottom: "1rem" }}>
                <ReturnDisplay value={product.expectedReturn} showTrend />
              </div>
              <p style={{ marginBottom: "1.5rem" }}>{product.description}</p>
              <button
                className={`btn ${inPortfolio || added ? "btn-success" : "btn-copper"}`}
                onClick={handleAdd}
                disabled={inPortfolio}
              >
                {inPortfolio ? "✓ In Portfolio" : added ? "✓ Added!" : "+ Add to Portfolio"}
              </button>
            </div>
          </div>

          {/* Attributes */}
          <div className="card" style={{ marginTop: "1.25rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Product Attributes</h3>
            <div className="pd-attrs">
              {[
                ["Category",        ATTR_LABELS.category[product.category]],
                ["Expected Return", `${product.expectedReturn}% per annum`],
                ["Risk Level",      product.riskLevel.charAt(0).toUpperCase() + product.riskLevel.slice(1)],
                ["Liquidity",       ATTR_LABELS.liquidity[product.liquidity]],
                ["Time Horizon",    ATTR_LABELS.timeHorizon[product.timeHorizon]],
                ["Min Investment",  formatPKR(product.minInvestment)],
              ].map(([label, val]) => (
                <div key={label} className="pd-attr-row">
                  <span className="pd-attr-label">{label}</span>
                  <span className="pd-attr-val">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk visualization */}
          <div className="card" style={{ marginTop: "1.25rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Risk Visualization</h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--ink3)", marginBottom: "0.5rem" }}>
              <span>Conservative</span><span>Aggressive</span>
            </div>
            <div className="progress-bar-track">
              <div
                className={`progress-bar-fill ${product.riskLevel === "low" ? "fill-green" : product.riskLevel === "medium" ? "fill-amber" : "fill-red"}`}
                style={{ width: `${riskPct}%` }}
              />
            </div>
            <div style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--ink2)" }}>
              Risk Score: <strong>{riskPct}/100</strong>
            </div>
          </div>
        </div>

        {/* Right: insights + calculator + comparison */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Decision insights */}
          <div className="card">
            <h3 style={{ marginBottom: "1rem" }}>💡 Decision Insights</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {insights.map((insight, i) => (
                <div key={i} className="insight-item anim-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="insight-dot">◆</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Return projection calculator */}
          <div className="card">
            <h3 style={{ marginBottom: "1rem" }}>📊 Return Projection Calculator</h3>
            <div className="input-group" style={{ marginBottom: "1rem" }}>
              <label>Investment Amount (PKR)</label>
              <input
                type="number"
                placeholder={`Min: ${formatPKR(product.minInvestment)}`}
                value={investAmount}
                onChange={e => setInvestAmount(e.target.value)}
                min={product.minInvestment}
              />
            </div>

            {projections.length > 0 && (
              <div className="proj-table">
                <div className="proj-header">
                  <span>Year</span><span>Projected Value</span><span>Gain</span>
                </div>
                {projections.map(row => (
                  <div key={row.year} className="proj-row anim-fade-in">
                    <span>Year {row.year}</span>
                    <span style={{ color: "var(--copper)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                      {formatPKR(row.amount)}
                    </span>
                    <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>
                      +{formatPKR(row.amount - parseFloat(investAmount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compare feature */}
          <div className="card">
            <h3 style={{ marginBottom: "1rem" }}>⚖️ Compare with Another Product</h3>
            <div className="input-group" style={{ marginBottom: "1rem" }}>
              <label>Select Product to Compare</label>
              <select value={compareId} onChange={e => setCompareId(e.target.value)}>
                <option value="">— Select —</option>
                {products
                  .filter(p => p.id !== product.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.name.slice(0, 40)}</option>
                  ))}
              </select>
            </div>

            {compareProduct && (
              <div className="compare-grid">
                {[
                  ["Product",     product.name.slice(0,30),                  compareProduct.name.slice(0,30)],
                  ["Return",      `${product.expectedReturn}%`,               `${compareProduct.expectedReturn}%`],
                  ["Risk",        product.riskLevel,                          compareProduct.riskLevel],
                  ["Liquidity",   product.liquidity,                          compareProduct.liquidity],
                  ["Horizon",     product.timeHorizon,                        compareProduct.timeHorizon],
                  ["Min Invest",  formatPKR(product.minInvestment),           formatPKR(compareProduct.minInvestment)],
                ].map(([label, a, b]) => (
                  <div key={label} className="cmp-row">
                    <span className="cmp-label">{label}</span>
                    <span className="cmp-val">{a}</span>
                    <span className="cmp-val">{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
