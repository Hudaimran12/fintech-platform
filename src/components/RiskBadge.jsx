import React from 'react';

const RISK_CONFIG = {
  low:    { label: 'Low Risk',    color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: '▼' },
  medium: { label: 'Medium Risk', color: '#eab308', bg: 'rgba(234,179,8,0.12)',  icon: '◆' },
  high:   { label: 'High Risk',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: '▲' },
};

/**
 * RiskBadge — displays risk level with appropriate color coding.
 * @param {string} riskLevel - 'low' | 'medium' | 'high'
 * @param {'sm'|'md'} size
 */
export default function RiskBadge({ riskLevel, size = 'sm' }) {
  const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.low;
  const padding = size === 'md' ? '0.3rem 0.75rem' : '0.15rem 0.55rem';
  const fontSize = size === 'md' ? '0.8rem' : '0.7rem';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}40`,
      borderRadius: '999px',
      padding, fontSize, fontWeight: 600,
      letterSpacing: '0.03em', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: '0.65em' }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
