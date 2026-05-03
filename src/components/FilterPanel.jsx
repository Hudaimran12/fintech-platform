import React from 'react';
import './FilterPanel.css';

const RISK_OPTIONS = ['low', 'medium', 'high'];
const CATEGORY_OPTIONS = ['savings', 'investment', 'insurance', 'crypto'];
const LIQUIDITY_OPTIONS = [
  { value: 'all', label: 'Any Liquidity' },
  { value: 'easy', label: 'Quick Access' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'locked', label: 'Locked' },
];
const HORIZON_OPTIONS = [
  { value: 'all', label: 'Any Horizon' },
  { value: 'short', label: 'Short Term' },
  { value: 'medium', label: 'Medium Term' },
  { value: 'long', label: 'Long Term' },
];

/**
 * FilterPanel — multi-criteria filter sidebar.
 * @param {object} filters - current filter state
 * @param {function} onFilterChange - called with updated filter object
 * @param {number} productCount - how many products match
 */
export default function FilterPanel({ filters, onFilterChange, productCount }) {
  function toggleMulti(key, value) {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  }

  function handleChange(key, value) {
    onFilterChange({ ...filters, [key]: value });
  }

  function resetAll() {
    onFilterChange({
      riskLevels: [],
      categories: [],
      minReturn: 0,
      maxReturn: 30,
      liquidity: 'all',
      timeHorizon: 'all',
      maxInvestment: '',
    });
  }

  const isActive = filters.riskLevels.length > 0 || filters.categories.length > 0 ||
    filters.liquidity !== 'all' || filters.timeHorizon !== 'all' || filters.maxInvestment;

  return (
    <aside className="filter-panel card">
      <div className="filter-header">
        <h3>Filters</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="filter-count">{productCount} results</span>
          {isActive && (
            <button className="btn btn-ghost btn-sm" onClick={resetAll}>Reset</button>
          )}
        </div>
      </div>

      {/* Risk Level */}
      <div className="filter-section">
        <h4>Risk Level</h4>
        <div className="checkbox-group">
          {RISK_OPTIONS.map(r => (
            <label key={r} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.riskLevels.includes(r)}
                onChange={() => toggleMulti('riskLevels', r)}
              />
              <span className={`risk-dot risk-${r}`} />
              <span style={{ textTransform: 'capitalize' }}>{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4>Category</h4>
        <div className="checkbox-group">
          {CATEGORY_OPTIONS.map(c => (
            <label key={c} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.categories.includes(c)}
                onChange={() => toggleMulti('categories', c)}
              />
              <span style={{ textTransform: 'capitalize' }}>{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Return Range */}
      <div className="filter-section">
        <h4>Return Range</h4>
        <div className="range-inputs">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min %</label>
            <input
              type="number" min={0} max={30} step={0.5}
              className="form-input"
              value={filters.minReturn}
              onChange={e => handleChange('minReturn', Number(e.target.value))}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max %</label>
            <input
              type="number" min={0} max={100} step={0.5}
              className="form-input"
              value={filters.maxReturn}
              onChange={e => handleChange('maxReturn', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Liquidity */}
      <div className="filter-section">
        <h4>Liquidity</h4>
        <select
          className="form-select"
          value={filters.liquidity}
          onChange={e => handleChange('liquidity', e.target.value)}
        >
          {LIQUIDITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Time Horizon */}
      <div className="filter-section">
        <h4>Time Horizon</h4>
        <select
          className="form-select"
          value={filters.timeHorizon}
          onChange={e => handleChange('timeHorizon', e.target.value)}
        >
          {HORIZON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Max Min Investment */}
      <div className="filter-section">
        <h4>Max Min. Investment (PKR)</h4>
        <input
          type="number" min={0} step={1000}
          className="form-input"
          placeholder="e.g. 50000"
          value={filters.maxInvestment}
          onChange={e => handleChange('maxInvestment', e.target.value ? Number(e.target.value) : '')}
        />
        <span className="form-hint">Show only products you can afford</span>
      </div>
    </aside>
  );
}
