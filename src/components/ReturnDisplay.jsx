import React from "react";

/**
 * ReturnDisplay — formats expected return percentage
 * Props: value (number), showTrend (bool)
 */
export default function ReturnDisplay({ value, showTrend = false }) {
  const color = value >= 12 ? "var(--red)" : value >= 7 ? "var(--amber)" : "var(--green)";
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color }}>
      {showTrend && "↑ "}
      {value?.toFixed(1)}%
      <span style={{ fontWeight: 400, fontSize: "0.75em", color: "var(--ink3)", marginLeft: 2 }}>
        {" "}p.a.
      </span>
    </span>
  );
}
