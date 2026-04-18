import React from "react";

/**
 * RiskBadge — displays risk level with color coding
 * Props: riskLevel (low|medium|high), size (sm|md)
 */
export default function RiskBadge({ riskLevel, size = "md" }) {
  const label = { low: "Low Risk", medium: "Med Risk", high: "High Risk" }[riskLevel] || riskLevel;
  return (
    <span className={`badge badge-${riskLevel}`} style={size === "sm" ? { fontSize: "0.65rem" } : {}}>
      {riskLevel === "low" && "●"} {riskLevel === "medium" && "●"} {riskLevel === "high" && "●"} {label}
    </span>
  );
}
