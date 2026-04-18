import React from "react";
import "./FilterPanel.css";

export const DEFAULT_FILTERS = {
  riskLevels:    [],
  minReturn:     0,
  maxReturn:     30,
  categories:    [],
  liquidity:     "all",
  timeHorizon:   "all",
  maxInvestment: 500000,
};

/**
 * FilterPanel — all 6 filtering controls with AND logic
 * Props: filters, onFilterChange, productCount, totalCount
 */
export default function FilterPanel({ filters, onFilterChange, productCount, totalCount }) {
  function toggleRisk(val) {
    const arr = filters.riskLevels;
    onFilterChange({
      ...filters,
      riskLevels: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
    });
  }

  function toggleCat(val) {
    const arr = filters.categories;
    onFilterChange({
      ...filters,
      categories: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
    });
  }

  function reset() { onFilterChange(DEFAULT_FILTERS); }

  const hasActiveFilters =
    filters.riskLevels.length > 0 ||
    filters.categories.length > 0 ||
    filters.liquidity !== "all" ||
    filters.timeHorizon !== "all" ||
    filters.minReturn > 0 ||
    filters.maxReturn < 30 ||
    filters.maxInvestment < 500000;

  return (
    <aside className="filter-panel">
      <div className="fp-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className="btn btn-danger btn-sm" onClick={reset}>Clear All</button>
        )}
      </div>

      <div className="fp-count">
        <span className="fp-count-num">{productCount}</span>
        <span> of {totalCount} products</span>
      </div>

      {/* ── Risk Level ── */}
      <div className="fp-section">
        <div className="fp-label">Risk Level</div>
        <div className="fp-risk-group">
          {[
            { val: "low",    label: "Low",    color: "var(--green)" },
            { val: "medium", label: "Medium", color: "var(--amber)" },
            { val: "high",   label: "High",   color: "var(--red)"   },
          ].map(r => (
            <button
              key={r.val}
              className={`risk-toggle ${filters.riskLevels.includes(r.val) ? "active" : ""}`}
              style={filters.riskLevels.includes(r.val) ? { borderColor: r.color, background: r.color + "20", color: r.color } : {}}
              onClick={() => toggleRisk(r.val)}
            >
              <span className="rt-dot" style={{ background: r.color }} />
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category ── */}
      <div className="fp-section">
        <div className="fp-label">Category</div>
        <div className="check-group">
          {[
            { val: "savings",    label: "💰 Savings" },
            { val: "investment", label: "📈 Investment" },
            { val: "insurance",  label: "🛡️ Insurance" },
            { val: "crypto",     label: "₿ Crypto" },
          ].map(c => (
            <label key={c.val} className="check-item">
              <input
                type="checkbox"
                checked={filters.categories.includes(c.val)}
                onChange={() => toggleCat(c.val)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* ── Return Range ── */}
      <div className="fp-section">
        <div className="fp-label">
          Expected Return
          <span className="fp-range-val"> {filters.minReturn}% — {filters.maxReturn}%</span>
        </div>
        <div className="range-group">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--ink3)", marginBottom: "0.25rem" }}>
            <span>Min: {filters.minReturn}%</span>
          </div>
          <input
            type="range" min={0} max={30} step={0.5}
            value={filters.minReturn}
            onChange={e => onFilterChange({ ...filters, minReturn: Math.min(parseFloat(e.target.value), filters.maxReturn - 1) })}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--ink3)", marginBottom: "0.25rem" }}>
            <span>Max: {filters.maxReturn}%</span>
          </div>
          <input
            type="range" min={0} max={30} step={0.5}
            value={filters.maxReturn}
            onChange={e => onFilterChange({ ...filters, maxReturn: Math.max(parseFloat(e.target.value), filters.minReturn + 1) })}
          />
        </div>
      </div>

      {/* ── Liquidity ── */}
      <div className="fp-section">
        <div className="fp-label">Liquidity</div>
        <div className="fp-select-group">
          {[
            { val: "all",      label: "Any" },
            { val: "easy",     label: "💧 Easy" },
            { val: "moderate", label: "🌊 Moderate" },
            { val: "locked",   label: "🔒 Locked" },
          ].map(opt => (
            <button
              key={opt.val}
              className={`sel-btn ${filters.liquidity === opt.val ? "active" : ""}`}
              onClick={() => onFilterChange({ ...filters, liquidity: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Time Horizon ── */}
      <div className="fp-section">
        <div className="fp-label">Time Horizon</div>
        <div className="fp-select-group">
          {[
            { val: "all",    label: "Any" },
            { val: "short",  label: "⏱ Short" },
            { val: "medium", label: "📅 Medium" },
            { val: "long",   label: "🗓 Long" },
          ].map(opt => (
            <button
              key={opt.val}
              className={`sel-btn ${filters.timeHorizon === opt.val ? "active" : ""}`}
              onClick={() => onFilterChange({ ...filters, timeHorizon: opt.val })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Max Min Investment ── */}
      <div className="fp-section">
        <div className="fp-label">Max Min. Investment</div>
        <div className="input-group">
          <input
            type="number"
            placeholder="e.g. 50000"
            value={filters.maxInvestment}
            min={0}
            step={1000}
            onChange={e => onFilterChange({ ...filters, maxInvestment: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--ink3)", marginTop: "0.3rem" }}>
          PKR — only show affordable products
        </div>
      </div>
    </aside>
  );
}
