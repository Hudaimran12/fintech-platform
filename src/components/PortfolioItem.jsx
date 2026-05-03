import React, { useState } from 'react';
import RiskBadge from './RiskBadge';
import ReturnDisplay from './ReturnDisplay';
import { usePortfolio } from '../context/PortfolioContext';
import { formatPKR } from '../utils/finance';
import './PortfolioItem.css';

export default function PortfolioItem({ item }) {
  const { removeFromPortfolio, updateAllocation } = usePortfolio();
  const [editing, setEditing] = useState(false);
  const [tempAmount, setTempAmount] = useState(item.allocatedAmount);

  function handleSave() {
    const val = Number(tempAmount);
    if (val >= item.minInvestment) {
      updateAllocation(item.id, val);
      setEditing(false);
    }
  }

  const yearlyReturn = ((item.allocatedAmount * item.expectedReturn) / 100).toFixed(0);

  return (
    <div className="portfolio-item card animate-fade">
      <div className="pi-left">
        <div className={`pi-cat-dot cat-${item.category}`} />
        <div>
          <div className="pi-name">{item.name}</div>
          <div className="pi-meta">
            <RiskBadge riskLevel={item.riskLevel} />
            <span className="pi-category">{item.category}</span>
          </div>
        </div>
      </div>

      <div className="pi-center">
        <ReturnDisplay value={item.expectedReturn} />
        <span className="pi-yearly">≈ {formatPKR(Number(yearlyReturn))}/yr</span>
      </div>

      <div className="pi-right">
        {editing ? (
          <div className="pi-edit">
            <input
              type="number"
              className="form-input"
              style={{ width: '120px' }}
              min={item.minInvestment}
              step={1000}
              value={tempAmount}
              onChange={e => setTempAmount(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>✕</button>
          </div>
        ) : (
          <div className="pi-amount-row">
            <span className="pi-amount">{formatPKR(item.allocatedAmount)}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setTempAmount(item.allocatedAmount); setEditing(true); }}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => removeFromPortfolio(item.id)}>Remove</button>
          </div>
        )}
      </div>
    </div>
  );
}
