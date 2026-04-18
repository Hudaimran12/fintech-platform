/**
 * FinVest — Core Financial Logic
 * All recommendation, portfolio, and decision logic lives here.
 * Exported as pure functions so they are testable and explainable.
 */

// ─── Risk tolerance → allowed product risk levels ─────────────────────────
const RISK_MAPPING = {
  conservative: ["low"],
  moderate:     ["low", "medium"],
  aggressive:   ["low", "medium", "high"],
};

// ─── Investment horizon → allowed product time horizons ──────────────────
const HORIZON_MAPPING = {
  short:  ["short"],
  medium: ["short", "medium"],
  long:   ["short", "medium", "long"],
};

// ─── Liquidity preference → allowed product liquidity levels ─────────────
const LIQUIDITY_MAPPING = {
  easy:     ["easy"],
  moderate: ["easy", "moderate"],
  locked:   ["easy", "moderate", "locked"],
};

/**
 * getRecommendations — core recommendation engine
 * Takes all products + a complete user profile, returns ranked matches.
 */
export function getRecommendations(products, userProfile) {
  if (!userProfile || !userProfile.riskTolerance) return [];

  const allowedRisk      = RISK_MAPPING[userProfile.riskTolerance]          || ["low"];
  const allowedHorizon   = HORIZON_MAPPING[userProfile.investmentHorizon]   || ["short"];
  const allowedLiquidity = LIQUIDITY_MAPPING[userProfile.liquidityPreference] || ["easy"];

  // Filter by budget
  const affordable = products.filter(
    (p) => p.minInvestment <= (userProfile.monthlyCapacity || 0)
  );

  // Apply all profile filters
  const matched = affordable.filter(
    (p) =>
      allowedRisk.includes(p.riskLevel) &&
      allowedHorizon.includes(p.timeHorizon) &&
      allowedLiquidity.includes(p.liquidity)
  );

  // Sort: conservative → lowest risk first; aggressive → highest return first
  if (userProfile.riskTolerance === "conservative") {
    return matched.sort((a, b) => a.expectedReturn - b.expectedReturn);
  }
  if (userProfile.riskTolerance === "moderate") {
    // best risk-return ratio
    return matched.sort(
      (a, b) =>
        b.expectedReturn / riskWeight(b.riskLevel) -
        a.expectedReturn / riskWeight(a.riskLevel)
    );
  }
  return matched.sort((a, b) => b.expectedReturn - a.expectedReturn);
}

function riskWeight(level) {
  return { low: 1, medium: 2, high: 3 }[level] || 1;
}

/**
 * applyFilters — product listing filter logic (AND logic)
 */
export function applyFilters(products, filters) {
  return products.filter((p) => {
    const riskOk =
      filters.riskLevels.length === 0 ||
      filters.riskLevels.includes(p.riskLevel);
    const returnOk =
      p.expectedReturn >= filters.minReturn &&
      p.expectedReturn <= filters.maxReturn;
    const catOk =
      filters.categories.length === 0 ||
      filters.categories.includes(p.category);
    const liquidityOk =
      filters.liquidity === "all" || p.liquidity === filters.liquidity;
    const horizonOk =
      filters.timeHorizon === "all" || p.timeHorizon === filters.timeHorizon;
    const budgetOk = p.minInvestment <= (filters.maxInvestment || Infinity);
    return riskOk && returnOk && catOk && liquidityOk && horizonOk && budgetOk;
  });
}

/**
 * generateDecisionInsight — dynamic product suitability text
 */
export function generateDecisionInsight(product) {
  const insights = [];

  if (product.riskLevel === "low") {
    insights.push(
      "Suitable for conservative investors prioritizing capital preservation and steady, predictable growth."
    );
  } else if (product.riskLevel === "medium") {
    insights.push(
      "Ideal for moderate investors seeking a balance between growth potential and manageable risk exposure."
    );
  } else if (product.riskLevel === "high") {
    insights.push(
      "Best for aggressive investors comfortable with significant volatility in exchange for higher return potential."
    );
  }

  if (product.liquidity === "locked") {
    insights.push(
      "Requires long-term commitment — early withdrawal may incur penalties or loss of accrued returns."
    );
  } else if (product.liquidity === "easy") {
    insights.push(
      "Highly liquid — funds can be accessed quickly, making this suitable as part of an emergency buffer."
    );
  }

  if (product.timeHorizon === "long") {
    insights.push(
      "Optimal when held for 5+ years; compounding effects significantly enhance total returns over time."
    );
  } else if (product.timeHorizon === "short") {
    insights.push(
      "Short-term product — suitable for goals within 1–2 years without tying up capital long-term."
    );
  }

  if (product.category === "crypto") {
    insights.push(
      "Digital assets are subject to regulatory and market volatility; only invest what you can afford to lose."
    );
  }

  if (product.category === "insurance") {
    insights.push(
      "Provides dual benefit of protection coverage and investment growth component."
    );
  }

  return insights;
}

/**
 * calculateProjectedReturn — simple compound interest projection
 * Returns array of { year, amount } for 1..years
 */
export function calculateProjectedReturn(principal, annualRate, years) {
  const results = [];
  for (let y = 1; y <= years; y++) {
    const amount = principal * Math.pow(1 + annualRate / 100, y);
    results.push({ year: y, amount: parseFloat(amount.toFixed(2)) });
  }
  return results;
}

/**
 * calculatePortfolioStats — weighted return, risk distribution, category breakdown
 */
export function calculatePortfolioStats(items) {
  const totalInvested = items.reduce((s, i) => s + (i.allocatedAmount || 0), 0);

  const weightedReturn =
    totalInvested === 0
      ? 0
      : items.reduce(
          (s, i) =>
            s + ((i.allocatedAmount || 0) / totalInvested) * i.product.expectedReturn,
          0
        );

  const riskDistribution = { low: 0, medium: 0, high: 0 };
  const categoryDistribution = {};

  items.forEach((i) => {
    const amt = i.allocatedAmount || 0;
    riskDistribution[i.product.riskLevel] =
      (riskDistribution[i.product.riskLevel] || 0) + amt;
    categoryDistribution[i.product.category] =
      (categoryDistribution[i.product.category] || 0) + amt;
  });

  // Convert to percentages
  const riskPct = {};
  Object.keys(riskDistribution).forEach((k) => {
    riskPct[k] = totalInvested > 0 ? (riskDistribution[k] / totalInvested) * 100 : 0;
  });

  // Diversification score: 0–100 based on category spread
  const catCount = Object.keys(categoryDistribution).length;
  const diversificationScore = Math.min(100, (catCount / 4) * 100);

  return {
    totalInvested,
    weightedReturn: parseFloat(weightedReturn.toFixed(2)),
    riskDistribution: riskPct,
    categoryDistribution,
    diversificationScore: Math.round(diversificationScore),
    isHighRiskHeavy: riskPct.high > 70,
  };
}

/**
 * formatPKR — consistent currency formatting
 */
export function formatPKR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "PKR —";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export { RISK_MAPPING, HORIZON_MAPPING, LIQUIDITY_MAPPING };
