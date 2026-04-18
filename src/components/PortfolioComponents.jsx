import React from "react";
import { formatPKR } from "../utils/finance";
import "./PortfolioComponents.css";

/**
 * PortfolioSummary — shows portfolio statistics
 * Props: portfolio (stats object from context)
 */
export function PortfolioSummary({ stats }) {
  const { totalInvested, weightedReturn, riskDistribution, diversificationScore, isHighRiskHeavy } = stats;

  return (
    <div className="port-summary">
      {/* Stats */}
      <div className="stat-bar" style={{ marginBottom: "1.25rem" }}>
        <div className="stat-item">
          <span className="stat-label">Total Invested</span>
          <span className="stat-value" style={{ color: "var(--copper)" }}>{formatPKR(totalInvested)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Weighted Return</span>
          <span className="stat-value" style={{ color: "var(--green)" }}>{weightedReturn.toFixed(2)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Diversification</span>
          <span className="stat-value">{diversificationScore}/100</span>
        </div>
      </div>

      {/* Warning */}
      {isHighRiskHeavy && (
        <div className="risk-warning anim-fade-in">
          ⚠️ <strong>High Risk Alert:</strong> Over 70% of your portfolio is in high-risk products. Consider diversifying.
        </div>
      )}

      {/* Risk distribution */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Risk Distribution</h3>
        {[
          { key: "low",    label: "Low Risk",    color: "fill-green", textColor: "var(--green)" },
          { key: "medium", label: "Medium Risk", color: "fill-amber", textColor: "var(--amber)" },
          { key: "high",   label: "High Risk",   color: "fill-red",   textColor: "var(--red)" },
        ].map(({ key, label, color, textColor }) => (
          <div key={key} className="progress-bar-wrap" style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <span style={{ color: "var(--ink2)" }}>{label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: textColor }}>
                {(riskDistribution[key] || 0).toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar-track">
              <div className={`progress-bar-fill ${color}`} style={{ width: `${riskDistribution[key] || 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * PortfolioItem — single portfolio entry
 * Props: item, onRemove, onUpdateAmount
 */
export function PortfolioItem({ item, onRemove, onUpdateAmount }) {
  const { product, allocatedAmount } = item;

  return (
    <div className="port-item anim-slide-up">
      <img src={product.image} alt={product.name} className="pi-img" />
      <div className="pi-info">
        <div className="pi-name">{product.name}</div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
          <span className={`badge badge-${product.category}`}>{product.category}</span>
          <span className={`badge badge-${product.riskLevel}`}>{product.riskLevel} risk</span>
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--ink3)", marginTop: "0.3rem", fontFamily: "var(--font-mono)" }}>
          Return: {product.expectedReturn}% p.a.
        </div>
      </div>
      <div className="pi-right">
        <div className="input-group" style={{ marginBottom: "0.4rem" }}>
          <label style={{ fontSize: "0.68rem" }}>Allocated (PKR)</label>
          <input
            type="number"
            value={allocatedAmount}
            min={product.minInvestment}
            onChange={e => onUpdateAmount(product.id, parseFloat(e.target.value) || 0)}
            style={{ width: 130, padding: "0.4rem 0.6rem", fontSize: "0.85rem" }}
          />
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--green)", fontFamily: "var(--font-mono)", marginBottom: "0.5rem" }}>
          Gain: +{formatPKR(allocatedAmount * product.expectedReturn / 100)}/yr
        </div>
        <button className="btn btn-danger btn-sm" onClick={() => onRemove(product.id)}>Remove</button>
      </div>
    </div>
  );
}
