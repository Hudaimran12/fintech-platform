import React from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { PortfolioSummary, PortfolioItem } from "../components/PortfolioComponents";

export default function Portfolio() {
  const { items, stats, removeFromPortfolio, updateAllocation } = usePortfolio();

  if (items.length === 0) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◎</div>
        <h2>Your Portfolio is Empty</h2>
        <p style={{ margin: "0.5rem 0 2rem" }}>Browse products and add them to start building your portfolio.</p>
        <Link to="/products" className="btn btn-copper btn-lg">Browse Products →</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My <span style={{ color: "var(--copper)" }}>Portfolio</span></h1>
        <p>{items.length} product{items.length !== 1 ? "s" : ""} · Adjust allocations and track your investment mix.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
        {/* Items list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ marginBottom: "0.25rem" }}>Holdings</h3>
          {items.map(item => (
            <PortfolioItem
              key={item.product.id}
              item={item}
              onRemove={removeFromPortfolio}
              onUpdateAmount={updateAllocation}
            />
          ))}
        </div>

        {/* Summary sidebar */}
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Portfolio Summary</h3>
          <PortfolioSummary stats={stats} />
          <Link to="/products" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem" }}>
            + Add More Products
          </Link>
        </div>
      </div>
    </div>
  );
}
