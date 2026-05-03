import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import RiskBadge from '../components/RiskBadge';
import ReturnDisplay from '../components/ReturnDisplay';
import { useProducts } from '../hooks/useProducts';
import { usePortfolio } from '../context/PortfolioContext';
import { generateDecisionInsight, projectReturns, formatPKR } from '../utils/finance';
import './ProductDetail.css';

const LIQUIDITY_LABEL = { easy: '⚡ Quick Access', moderate: '🕐 Moderate', locked: '🔒 Locked' };
const HORIZON_LABEL = { short: '1–2 Years', medium: '3–5 Years', long: '5+ Years' };

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToPortfolio, removeFromPortfolio, isInPortfolio } = usePortfolio();

  const [projAmount, setProjAmount] = useState('');
  const [compareId, setCompareId] = useState('');

  const product = products.find(p => p.id === Number(id));
  const inPortfolio = product ? isInPortfolio(product.id) : false;

  const insights = useMemo(() => product ? generateDecisionInsight(product) : [], [product]);

  const projections = useMemo(() => {
    const amt = Number(projAmount);
    if (!product || !amt || amt < 100) return [];
    return projectReturns(amt, product.expectedReturn, 10);
  }, [projAmount, product]);

  const compareProduct = products.find(p => p.id === Number(compareId));

  if (loading) return <div className="page-wrapper loading-center"><div className="loading-spinner" /></div>;
  if (!product) return (
    <div className="page-wrapper container">
      <div className="empty-state" style={{ marginTop: '3rem' }}>
        <div className="empty-icon">❓</div>
        <h3>Product Not Found</h3>
        <p>The product ID "{id}" does not exist.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>← Back to Products</Link>
      </div>
    </div>
  );

  const riskPct = { low: 25, medium: 60, high: 90 }[product.riskLevel];

  function AttributeRow({ label, value }) {
    return (
      <div className="attr-row">
        <span className="attr-label">{label}</span>
        <span className="attr-value">{value}</span>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container pd-container">
        <Link to="/products" className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0 }}>← Back to Products</Link>

        <div className="pd-layout">
          {/* Main */}
          <div className="pd-main">
            {/* Header card */}
            <div className="card pd-header-card animate-fade">
              <div className="pd-top">
                <div>
                  <span className={`badge badge-${product.category}`} style={{ marginBottom: '0.75rem' }}>{product.category}</span>
                  <h1 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{product.name}</h1>
                  <ReturnDisplay value={product.expectedReturn} large />
                </div>
                <RiskBadge riskLevel={product.riskLevel} size="md" />
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginTop: '1rem' }}>{product.description}</p>
            </div>

            {/* Attributes */}
            <div className="card animate-fade" style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Product Attributes</h3>
              <AttributeRow label="Category" value={<span style={{ textTransform: 'capitalize' }}>{product.category}</span>} />
              <AttributeRow label="Expected Annual Return" value={<ReturnDisplay value={product.expectedReturn} />} />
              <AttributeRow label="Risk Level" value={<RiskBadge riskLevel={product.riskLevel} />} />
              <AttributeRow label="Liquidity" value={LIQUIDITY_LABEL[product.liquidity]} />
              <AttributeRow label="Time Horizon" value={HORIZON_LABEL[product.timeHorizon]} />
              <AttributeRow label="Minimum Investment" value={formatPKR(product.minInvestment)} />

              {/* Risk gauge */}
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                  <span>Risk Level</span><span style={{ textTransform: 'capitalize' }}>{product.riskLevel}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{
                    width: `${riskPct}%`,
                    background: product.riskLevel === 'low' ? '#22c55e' : product.riskLevel === 'medium' ? '#eab308' : '#ef4444'
                  }} />
                </div>
              </div>
            </div>

            {/* Decision Insights */}
            <div className="card animate-fade" style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Decision Insights</h3>
              <div className="insights-list">
                {insights.map((ins, i) => (
                  <div key={i} className="insight-item">
                    <span className="insight-dot" />
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Calculator */}
            <div className="card animate-fade" style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Return Projection Calculator</h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Enter an investment amount to see compound growth over 10 years.</p>
              <input
                type="number" min={product.minInvestment} step={1000}
                className="form-input" style={{ maxWidth: '280px' }}
                placeholder={`Min. ${formatPKR(product.minInvestment)}`}
                value={projAmount}
                onChange={e => setProjAmount(e.target.value)}
              />
              {projections.length > 0 && (
                <div className="projection-table" style={{ marginTop: '1rem' }}>
                  <div className="proj-header">
                    <span>Year</span><span>Projected Value</span><span>Gain</span>
                  </div>
                  {projections.filter((_, i) => [0,1,2,4,6,9].includes(i)).map(row => (
                    <div key={row.year} className="proj-row">
                      <span>Year {row.year}</span>
                      <span style={{ fontWeight: 600 }}>{formatPKR(row.value)}</span>
                      <span style={{ color: 'var(--color-green)' }}>+{formatPKR(row.value - Number(projAmount))}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comparison */}
            <div className="card animate-fade" style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Compare with Another Product</h3>
              <select className="form-select" style={{ maxWidth: '320px' }} value={compareId} onChange={e => setCompareId(e.target.value)}>
                <option value="">-- Select a product --</option>
                {products.filter(p => p.id !== product.id).map(p => (
                  <option key={p.id} value={p.id}>{p.name.substring(0, 50)}</option>
                ))}
              </select>

              {compareProduct && (
                <div className="compare-grid" style={{ marginTop: '1.25rem' }}>
                  {[product, compareProduct].map(cp => (
                    <div key={cp.id} className="compare-col card">
                      <span className={`badge badge-${cp.category}`}>{cp.category}</span>
                      <h4 style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{cp.name.substring(0, 60)}</h4>
                      <div style={{ margin: '0.5rem 0' }}><ReturnDisplay value={cp.expectedReturn} /></div>
                      <RiskBadge riskLevel={cp.riskLevel} />
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {LIQUIDITY_LABEL[cp.liquidity]} · {HORIZON_LABEL[cp.timeHorizon]}
                      </div>
                      <div style={{ fontWeight: 600, marginTop: '0.5rem', fontSize: '0.85rem' }}>{formatPKR(cp.minInvestment)} min</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="pd-sidebar">
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Add to Portfolio</h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <ReturnDisplay value={product.expectedReturn} large />
              </div>
              <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Min. investment: <strong>{formatPKR(product.minInvestment)}</strong></p>
              <button
                className={`btn btn-lg ${inPortfolio ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => inPortfolio ? removeFromPortfolio(product.id) : addToPortfolio(product)}
              >
                {inPortfolio ? '✓ In Portfolio — Remove' : '+ Add to Portfolio'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
