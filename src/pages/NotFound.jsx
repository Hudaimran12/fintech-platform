import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: "center", paddingTop: "5rem" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "6rem", fontWeight: 800, color: "var(--border2)", lineHeight: 1 }}>404</div>
      <h2 style={{ margin: "1rem 0 0.5rem" }}>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-copper" style={{ marginTop: "2rem" }}>← Back to Home</Link>
    </div>
  );
}
