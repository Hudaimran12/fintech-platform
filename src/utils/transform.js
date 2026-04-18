/**
 * transformToFinancialProduct
 * Converts raw Fake Store API data to financial instruments.
 * Mapping is DETERMINISTIC — same input always yields same output.
 */

const CATEGORY_MAP = {
  "electronics":      "investment",
  "jewelery":         "savings",
  "men's clothing":   "insurance",
  "women's clothing": "crypto",
};

const RISK_MAP = {
  investment: "medium",
  savings:    "low",
  insurance:  "low",
  crypto:     "high",
};

const LIQUIDITY_MAP = {
  investment: "moderate",
  savings:    "easy",
  insurance:  "locked",
  crypto:     "easy",
};

const HORIZON_MAP = {
  investment: "long",
  savings:    "short",
  insurance:  "long",
  crypto:     "long",
};

/**
 * Deterministic return based on product id + risk level.
 * Uses id as a seed so the same product always gets the same return.
 */
function deterministicReturn(id, riskLevel) {
  const seed = (id * 7919) % 100; // prime-based hash
  if (riskLevel === "low")    return parseFloat((3  + (seed % 40) / 10).toFixed(2)); // 3–7%
  if (riskLevel === "medium") return parseFloat((7  + (seed % 50) / 10).toFixed(2)); // 7–12%
  if (riskLevel === "high")   return parseFloat((12 + (seed % 150) / 10).toFixed(2)); // 12–27%
  return 5.0;
}

export function transformToFinancialProduct(apiProduct) {
  const category   = CATEGORY_MAP[apiProduct.category] || "investment";
  const riskLevel  = RISK_MAP[category];
  const liquidity  = LIQUIDITY_MAP[category];
  const timeHorizon = HORIZON_MAP[category];
  const expectedReturn = deterministicReturn(apiProduct.id, riskLevel);

  // Scale price to PKR minimum investment
  const minInvestment = Math.round(apiProduct.price * 1000 / 100) * 100;

  return {
    id:             apiProduct.id,
    name:           apiProduct.title.slice(0, 50),
    category,
    description:    apiProduct.description,
    expectedReturn,
    riskLevel,
    liquidity,
    timeHorizon,
    minInvestment,
    image:          apiProduct.image,
    rating:         apiProduct.rating?.rate || 4.0,
  };
}

export function transformAll(apiProducts) {
  return apiProducts.map(transformToFinancialProduct);
}
