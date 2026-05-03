import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import ReturnDisplay from './ReturnDisplay';
import { usePortfolio } from '../context/PortfolioContext';
import { formatPKR } from '../utils/finance';
import './ProductCard.css';

const CATEGORY_ICONS = {
  savings: '🏦',
  investment: '📈',
  insurance: '🛡️',
  crypto: '₿',
};

const LIQUIDITY_LABEL = { easy: 'Quick Access', moderate: 'Moderate', locked: 'Locked' };

export default function ProductCard({ product }) {
  const { addToPortfolio, removeFromPortfolio, isInPortfolio } = usePortfolio();
  const [added, setAdded] = useState(false);
  const inPortfolio = isInPortfolio(product.id);

  function handlePortfolioToggle(e) {
    e.preventDefault();
    if (inPortfolio) {
      removeFromPortfolio(product.id);
    } else {
      addToPortfolio(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="product-card card card-hover animate-fade">
      {/* Category icon overlay */}
      <div className={`card-category-stripe cat-${product.category}`} />

      <div className="card-top">
        <div className="card-icon">{CATEGORY_ICONS[product.category] || '💹'}</div>
        <span className={`badge badge-${product.category}`}>{product.category}</span>
      </div>

      <h3 className="card-name">{product.name}</h3>

      <div className="card-return">
        <ReturnDisplay value={product.expectedReturn} />
      </div>

      {/* Hover overlay with extra details */}
      <div className="details-overlay">
        <div className="overlay-row">
          <span className="overlay-label">Liquidity</span>
          <span className="overlay-value">{LIQUIDITY_LABEL[product.liquidity]}</span>
        </div>
        <div className="overlay-row">
          <span className="overlay-label">Time Horizon</span>
          <span className="overlay-value" style={{ textTransform: 'capitalize' }}>{product.timeHorizon} term</span>
        </div>
        <div className="overlay-row">
          <span className="overlay-label">Min. Investment</span>
          <span className="overlay-value">{formatPKR(product.minInvestment)}</span>
        </div>
      </div>

      <div className="card-risk-row">
        <RiskBadge riskLevel={product.riskLevel} />
        <span className="card-min">{formatPKR(product.minInvestment)} min</span>
      </div>

      <div className="card-actions">
        <Link to={`/product/${product.id}`} className="btn btn-secondary btn-sm">
          View Details
        </Link>
        <button
          className={`btn btn-sm ${inPortfolio ? 'btn-added' : 'btn-primary'}`}
          onClick={handlePortfolioToggle}
        >
          {inPortfolio ? '✓ Added' : added ? '✓ Done!' : '+ Portfolio'}
        </button>
      </div>
    </div>
  );
}
