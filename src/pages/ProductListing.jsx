import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import FilterPanel, { DEFAULT_FILTERS } from "../components/FilterPanel";
import { applyFilters } from "../utils/finance";
import "./ProductListing.css";

const SORT_OPTIONS = [
  { value: "return-high", label: "Return: High → Low" },
  { value: "return-low",  label: "Return: Low → High" },
  { value: "risk-low",    label: "Risk: Low → High" },
  { value: "invest-low",  label: "Min Investment: Low → High" },
];

export default function ProductListing() {
  const { products, loading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    const cat = searchParams.get("category");
    return cat
      ? { ...DEFAULT_FILTERS, categories: [cat] }
      : DEFAULT_FILTERS;
  });
  const [sort, setSort] = useState("return-high");
  const [search, setSearch] = useState("");

  // Apply URL category param when it changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setFilters(f => ({ ...f, categories: [cat] }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = applyFilters(products, filters);

    // Search by name
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sort === "return-high") return b.expectedReturn - a.expectedReturn;
      if (sort === "return-low")  return a.expectedReturn - b.expectedReturn;
      if (sort === "risk-low") {
        const w = { low: 0, medium: 1, high: 2 };
        return w[a.riskLevel] - w[b.riskLevel];
      }
      if (sort === "invest-low") return a.minInvestment - b.minInvestment;
      return 0;
    });
  }, [products, filters, sort, search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Financial <span style={{ color: "var(--copper)" }}>Products</span></h1>
        <p>Explore and filter {products.length} financial instruments across 4 categories.</p>
      </div>

      {/* Search + sort bar */}
      <div className="pl-toolbar">
        <div className="search-wrap">
          <span className="search-icon-pl">⌕</span>
          <input
            type="text"
            placeholder="Search products by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: "2.2rem" }}
          />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ maxWidth: 220 }}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="pl-layout">
        {/* Filter panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          productCount={filtered.length}
          totalCount={products.length}
        />

        {/* Product grid */}
        <div className="pl-grid-wrap">
          {error && (
            <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--red)" }}>
              Failed to load products: {error}
            </div>
          )}

          {loading ? (
            <div className="pl-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 300, borderRadius: 16 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>◎</div>
              <h3>No products match your filters</h3>
              <p style={{ marginTop: "0.5rem" }}>Try adjusting your filters or clearing them.</p>
              <button
                className="btn btn-outline"
                style={{ marginTop: "1rem" }}
                onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(""); }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="pl-grid">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  animDelay={Math.min(i * 50, 400)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
