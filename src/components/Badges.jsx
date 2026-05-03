import { RISK_LABEL, LIQUIDITY_LABEL, HORIZON_LABEL, CATEGORY_LABEL, formatReturn } from '../utils/finance';

// ── Risk Badge ──────────────────────────────────────────────
export function RiskBadge({ riskLevel, size = 'sm' }) {
  return (
    <span className={`badge badge-${riskLevel}`} style={size === 'lg' ? { fontSize: '13px', padding: '5px 14px' } : {}}>
      <span style={{ fontSize: '8px' }}>●</span>
      {RISK_LABEL[riskLevel] || riskLevel}
    </span>
  );
}

// ── Return Display ──────────────────────────────────────────
export function ReturnDisplay({ value, showLabel = true }) {
  const color = value >= 12 ? 'var(--clr-high)' : value >= 7 ? 'var(--clr-medium)' : 'var(--clr-low)';
  return (
    <span style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
      {showLabel && <span style={{ fontSize: '11px', opacity: 0.7, marginRight: 2 }}>p.a. </span>}
      {formatReturn(value)}
    </span>
  );
}

// ── Category Badge ──────────────────────────────────────────
export function CategoryBadge({ category }) {
  return (
    <span className={`badge badge-${category}`}>
      {CATEGORY_LABEL[category] || category}
    </span>
  );
}

// ── Liquidity Badge ─────────────────────────────────────────
export function LiquidityBadge({ liquidity }) {
  const icons = { easy: '💧', moderate: '〜', locked: '🔒' };
  const colors = { easy: 'var(--clr-low)', moderate: 'var(--clr-medium)', locked: 'var(--clr-high)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      color: colors[liquidity], fontSize: 12, fontFamily: 'var(--font-mono)',
    }}>
      {icons[liquidity]} {LIQUIDITY_LABEL[liquidity]}
    </span>
  );
}

// ── Horizon Badge ────────────────────────────────────────────
export function HorizonBadge({ timeHorizon }) {
  return (
    <span style={{ color: 'var(--clr-text-dim)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
      ⏱ {HORIZON_LABEL[timeHorizon]}
    </span>
  );
}
