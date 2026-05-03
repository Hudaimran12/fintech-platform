import React from 'react';
import { formatPKR } from '../utils/finance';
import './PortfolioSummary.css';

export default function PortfolioSummary({ stats }) {
  const { totalInvested, weightedReturn, riskDistribution, diversificationScore, productCount } = stats;

  const riskColors = { low: '#22c55e', medium: '#eab308', high: '#ef4444' };

  return (
    <div className="portfolio-summary">
      <div className="summary-grid">
        <div className="stat-card">
          <div className="stat-label">Total Invested</div>
          <div className="stat-value">{formatPKR(totalInvested)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Weighted Return</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>{weightedReturn.toFixed(2)}%</div>
          <div className="stat-change positive">annual expected</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Products</div>
          <div className="stat-value">{productCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Diversification</div>
          <div className="stat-value">{diversificationScore}/100</div>
          <div className="progress-bar-wrap" style={{ marginTop: '0.5rem' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${diversificationScore}%`,
                background: diversificationScore > 60 ? '#22c55e' : diversificationScore > 30 ? '#eab308' : '#ef4444'
              }}
            />
          </div>
        </div>
      </div>

      {productCount > 0 && (
        <div className="risk-breakdown card" style={{ marginTop: '1.25rem' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-muted)' }}>
            Risk Distribution
          </h4>
          {Object.entries(riskDistribution).map(([level, pct]) => (
            pct > 0 && (
              <div key={level} className="risk-bar-row">
                <span className="risk-bar-label" style={{ textTransform: 'capitalize' }}>{level}</span>
                <div className="progress-bar-wrap" style={{ flex: 1 }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%`, background: riskColors[level] }}
                  />
                </div>
                <span className="risk-bar-pct">{pct.toFixed(1)}%</span>
              </div>
            )
          ))}
          {riskDistribution.high > 70 && (
            <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
              ⚠️ Over 70% of your portfolio is in high-risk assets. Consider diversifying.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
