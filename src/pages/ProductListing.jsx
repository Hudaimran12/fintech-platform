import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { applyFilters } from '../utils/finance';
import './ProductListing.css';

const DEFAULT_FILTERS = {
  riskLevels: [],
  categories: [],
  minReturn: 0,
  maxReturn: 30,
  liquidity: 'all',
  timeHorizon: 'all',
  maxInvestment: '',
};

const SORT_OPTIONS = [
  { value: 'return-desc', label: 'Highest Return' },
  { value: 'return-asc', label: 'Lowest Return' },
  { value: 'risk-asc', label: 'Lowest Risk' },
  { value: 'invest-asc', label: 'Lowest Min. Investment' },
];

function sortProducts(products, sortBy) {
  const riskOrder = { low: 0, medium: 1, high: 2 };
  const p = [...products];
  switch (sortBy) {
    case 'return-asc': return p.sort((a, b) => a.expectedReturn - b.expectedReturn);
    case 'risk-asc': return p.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    case 'invest-asc': return p.sort((a, b) => a.minInvestment - b.minInvestment);
    default: return p.sort((a, b) => b.expectedReturn - a.expectedReturn);
  }
}

export default function ProductListing() {
  const { products, loading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get('category');

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    categories: initCat ? [initCat] : [],
  });
  const [sortBy, setSortBy] = useState('return-desc');

  const filtered = useMemo(() => sortProducts(applyFilters(products, filters), sortBy), [products, filters, sortBy]);

  if (error) return (
    <div className="page-wrapper container">
      <div className="alert alert-danger" style={{ marginTop: '2rem' }}>⚠️ Failed to load products: {error}</div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="pl-header">
          <div>
            <h1>Financial Products</h1>
            <p>Compare and filter across {products.length} instruments</p>
          </div>
        </div>

        <div className="pl-layout">
          <FilterPanel filters={filters} onFilterChange={setFilters} productCount={filtered.length} />

          <main className="pl-main">
            <div className="pl-toolbar">
              <span className="pl-count">{filtered.length} products</span>
              <select className="form-select" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="loading-center"><div className="loading-spinner" /><p>Fetching products…</p></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Products Match</h3>
                <p>Try relaxing some filters to see more results.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
