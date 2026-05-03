/**
 * finance.js
 * Core financial logic: recommendation engine, portfolio calculations,
 * decision insight generation.
 */

/* ─── Risk tolerance → allowed product risk levels ─── */
export const RISK_TOLERANCE_MAP = {
  conservative: ['low'],
  moderate: ['low', 'medium'],
  aggressive: ['low', 'medium', 'high'],
};

/* ─── Investment horizon → allowed product time horizons ─── */
export const HORIZON_MAP = {
  short: ['short'],
  medium: ['short', 'medium'],
  long: ['short', 'medium', 'long'],
};

/* ─── Liquidity preference → allowed product liquidity ─── */
export const LIQUIDITY_PREF_MAP = {
  easy: ['easy'],
  moderate: ['easy', 'moderate'],
  locked: ['easy', 'moderate', 'locked'],
};

/**
 * Returns products recommended for a given user profile.
 * Completely dynamic — no hardcoded product list.
 */
export function getRecommendations(products, userProfile) {
  if (!userProfile || !userProfile.riskTolerance) return [];

  const allowedRisk = RISK_TOLERANCE_MAP[userProfile.riskTolerance] || ['low'];
  const allowedHorizon = HORIZON_MAP[userProfile.investmentHorizon] || ['short'];
  const allowedLiquidity = LIQUIDITY_PREF_MAP[userProfile.liquidityPreference] || ['easy'];

  const recommended = products.filter(p =>
    p.minInvestment <= (userProfile.monthlyCapacity || Infinity) &&
    allowedRisk.includes(p.riskLevel) &&
    allowedHorizon.includes(p.timeHorizon) &&
    allowedLiquidity.includes(p.liquidity)
  );

  // Sort: conservative → lowest risk first (then highest return); others → highest return first
  if (userProfile.riskTolerance === 'conservative') {
    const riskOrder = { low: 0, medium: 1, high: 2 };
    return recommended.sort((a, b) =>
      riskOrder[a.riskLevel] - riskOrder[b.riskLevel] ||
      b.expectedReturn - a.expectedReturn
    );
  }
  return recommended.sort((a, b) => b.expectedReturn - a.expectedReturn);
}

/**
 * Applies multi-criteria AND filter to a product list.
 */
export function applyFilters(products, filters) {
  return products.filter(p => {
    const riskOk = filters.riskLevels.length === 0 || filters.riskLevels.includes(p.riskLevel);
    const returnOk = p.expectedReturn >= filters.minReturn && p.expectedReturn <= filters.maxReturn;
    const catOk = filters.categories.length === 0 || filters.categories.includes(p.category);
    const liqOk = filters.liquidity === 'all' || p.liquidity === filters.liquidity;
    const horizonOk = filters.timeHorizon === 'all' || p.timeHorizon === filters.timeHorizon;
    const budgetOk = !filters.maxInvestment || p.minInvestment <= filters.maxInvestment;
    return riskOk && returnOk && catOk && liqOk && horizonOk && budgetOk;
  });
}

/**
 * Calculates portfolio aggregate statistics.
 */
export function calculatePortfolioStats(items) {
  const totalInvested = items.reduce((sum, i) => sum + (i.allocatedAmount || 0), 0);

  const weightedReturn = totalInvested === 0 ? 0 :
    items.reduce((sum, i) => sum + ((i.allocatedAmount / totalInvested) * i.expectedReturn), 0);

  const riskDistribution = { low: 0, medium: 0, high: 0 };
  const categoryDistribution = {};

  items.forEach(i => {
    const w = totalInvested > 0 ? (i.allocatedAmount / totalInvested) * 100 : 0;
    riskDistribution[i.riskLevel] = (riskDistribution[i.riskLevel] || 0) + w;
    categoryDistribution[i.category] = (categoryDistribution[i.category] || 0) + w;
  });

  // Diversification score: 0–100 based on number of distinct categories and risk spread
  const categories = Object.keys(categoryDistribution).length;
  const riskLevels = Object.values(riskDistribution).filter(v => v > 0).length;
  const diversificationScore = Math.min(100, Math.round((categories * 20) + (riskLevels * 15) + (items.length * 5)));

  return {
    totalInvested,
    weightedReturn: parseFloat(weightedReturn.toFixed(2)),
    riskDistribution,
    categoryDistribution,
    diversificationScore,
    productCount: items.length,
  };
}

/**
 * Generates human-readable decision insights for a product. Fully dynamic.
 */
export function generateDecisionInsight(product) {
  const insights = [];

  // Risk-based
  if (product.riskLevel === 'low') {
    insights.push('Suitable for conservative investors prioritizing capital preservation.');
  } else if (product.riskLevel === 'medium') {
    insights.push('Appropriate for moderate investors seeking balanced growth.');
  } else {
    insights.push('Best for aggressive investors comfortable with significant volatility.');
  }

  // Return-based
  if (product.expectedReturn >= 15) {
    insights.push(`High expected return of ${product.expectedReturn}% reflects elevated risk.`);
  } else if (product.expectedReturn <= 6) {
    insights.push(`Stable return of ${product.expectedReturn}% provides predictable income.`);
  }

  // Liquidity
  if (product.liquidity === 'locked') {
    insights.push('Requires long-term commitment; early withdrawal may incur penalties.');
  } else if (product.liquidity === 'easy') {
    insights.push('Funds accessible quickly — good for emergency buffer strategies.');
  }

  // Time horizon
  if (product.timeHorizon === 'long') {
    insights.push('Optimal when held 5+ years to let compounding amplify gains.');
  } else if (product.timeHorizon === 'short') {
    insights.push('Suitable for near-term financial goals within 1–2 years.');
  }

  // Category
  if (product.category === 'crypto') {
    insights.push('Crypto assets are highly speculative; only allocate what you can afford to lose.');
  } else if (product.category === 'insurance') {
    insights.push('Provides financial protection alongside an investment component.');
  }

  return insights;
}

/**
 * Simple compound interest projection.
 * Returns array of { year, value } over `years` period.
 */
export function projectReturns(principal, annualReturnPct, years) {
  const rate = annualReturnPct / 100;
  return Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    value: Math.round(principal * Math.pow(1 + rate, i + 1)),
  }));
}

export function formatPKR(amount) {
  if (amount >= 10_000_000) return `₨ ${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `₨ ${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1000) return `₨ ${(amount / 1000).toFixed(1)}K`;
  return `₨ ${amount}`;
}
