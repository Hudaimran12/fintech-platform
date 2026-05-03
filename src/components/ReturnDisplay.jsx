import React from 'react';

/**
 * ReturnDisplay — shows expected annual return with color gradient.
 * @param {number} value - return percentage
 * @param {boolean} large - bigger font
 */
export default function ReturnDisplay({ value, large = false }) {
  const color = value >= 15 ? '#ef4444' : value >= 8 ? '#eab308' : '#22c55e';
  const size = large ? '2rem' : '1.1rem';

  return (
    <span style={{
      color, fontSize: size, fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {value?.toFixed(1)}%
      <span style={{ fontSize: '0.6em', fontWeight: 500, marginLeft: '2px', opacity: 0.8 }}>p.a.</span>
    </span>
  );
}
