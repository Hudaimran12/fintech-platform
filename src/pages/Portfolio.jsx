import React from 'react';
import { Link } from 'react-router-dom';
import PortfolioItem from '../components/PortfolioItem';
import PortfolioSummary from '../components/PortfolioSummary';
import { usePortfolio } from '../context/PortfolioContext';
import './Portfolio.css';

export default function Portfolio() {
  const { items, stats } = usePortfolio();

  return (
    <div className="page-wrapper">
      <div className="container port-container">
        <div className="port-header">
          <div>
            <h1>My Portfolio</h1>
            <p>Manage your selected financial instruments and track aggregate performance.</p>
          </div>
          <Link to="/products" className="btn btn-primary">+ Add Products</Link>
        </div>

        {items.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '3rem' }}>
            <div className="empty-icon">💼</div>
            <h3>Your Portfolio is Empty</h3>
            <p>Browse products and add them to your portfolio to track performance.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>Browse Products</Link>
          </div>
        ) : (
          <>
            <PortfolioSummary stats={stats} />
            <div className="port-items" style={{ marginTop: '1.5rem' }}>
              <div className="section-header">
                <h2 className="section-title">Holdings ({items.length})</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map(item => <PortfolioItem key={item.id} item={item} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
