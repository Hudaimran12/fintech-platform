import React, { useState } from "react";
import { Link } from "react-router-dom";
import RiskBadge from "./RiskBadge";
import ReturnDisplay from "./ReturnDisplay";
import { usePortfolio } from "../context/PortfolioContext";
import { formatPKR } from "../utils/finance";
import "./ProductCard.css";

/**
 * ProductCard — displays a financial product summary
 * Props: product, onAddToPortfolio (optional override), isInPortfolio
 */
export default function ProductCard({ product, animDelay = 0 }) {
  const { addToPortfolio, isInPortfolio } = usePortfolio();
  const inPortfolio = isInPortfolio(product.id);
  const [added, setAdded] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (inPortfolio) return;
    addToPortfolio(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const liquidityLabel = { easy: "Liquid", moderate: "Moderate", locked: "Locked" };
  const horizonLabel   = { short: "Short-term", medium: "Mid-term", long: "Long-term" };

  return (
    <div
      className="product-card anim-slide-up"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Image */}
      <div className="pc-image-wrap">
        <img src={product.image} alt={product.name} className="pc-image" />
        <div className="pc-image-overlay">
          <span className={`badge badge-${product.category}`}>{product.category}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="pc-body">
        <div className="pc-top">
          <RiskBadge riskLevel={product.riskLevel} size="sm" />
        </div>

        <h3 className="pc-name">{product.name}</h3>

        <div className="pc-return">
          <ReturnDisplay value={product.expectedReturn} showTrend />
        </div>

        {/* Hover overlay details */}
        <div className="pc-details-overlay">
          <div className="pc-detail-row">
            <span>Liquidity</span>
            <span>{liquidityLabel[product.liquidity]}</span>
          </div>
          <div className="pc-detail-row">
            <span>Horizon</span>
            <span>{horizonLabel[product.timeHorizon]}</span>
          </div>
          <div className="pc-detail-row">
            <span>Min. Investment</span>
            <span>{formatPKR(product.minInvestment)}</span>
          </div>
        </div>

        <div className="pc-actions">
          <Link to={`/product/${product.id}`} className="btn btn-outline btn-sm">
            View Details
          </Link>
          <button
            className={`btn btn-sm ${inPortfolio || added ? "btn-success" : "btn-primary"}`}
            onClick={handleAdd}
            disabled={inPortfolio}
          >
            {inPortfolio ? "✓ Added" : added ? "✓ Added!" : "+ Portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}
