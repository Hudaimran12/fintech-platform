/**
 * transform.js
 * Transforms raw Fake Store API products into FinTech financial instruments.
 * All mappings are deterministic — same input always produces same output.
 */

const CATEGORY_MAP = {
  'electronics': 'investment',
  'jewelery': 'savings',
  "men's clothing": 'insurance',
  "women's clothing": 'crypto',
};

const RISK_MAP = {
  investment: 'medium',
  savings: 'low',
  insurance: 'low',
  crypto: 'high',
};

const LIQUIDITY_MAP = {
  savings: 'easy',
  investment: 'moderate',
  insurance: 'locked',
  crypto: 'easy',
};

const TIME_HORIZON_MAP = {
  savings: 'short',
  investment: 'long',
  insurance: 'long',
  crypto: 'long',
};

/**
 * Deterministic pseudo-random based on id — same id always gives same float in range.
 */
function seededRandom(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000;
  const r = x - Math.floor(x);
  return parseFloat((min + r * (max - min)).toFixed(2));
}

const RETURN_RANGE = {
  low: [3, 7],
  medium: [7, 13],
  high: [13, 28],
};

export function transformToFinancialProduct(apiProduct) {
  const category = CATEGORY_MAP[apiProduct.category] || 'investment';
  const riskLevel = RISK_MAP[category];
  const [rMin, rMax] = RETURN_RANGE[riskLevel];
  const expectedReturn = seededRandom(apiProduct.id * 3, rMin, rMax);
  const minInvestment = Math.round(apiProduct.price * 900 / 1000) * 1000 || 5000;

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category,
    description: apiProduct.description,
    minInvestment,
    riskLevel,
    expectedReturn,
    liquidity: LIQUIDITY_MAP[category],
    timeHorizon: TIME_HORIZON_MAP[category],
    image: apiProduct.image,
    rating: apiProduct.rating?.rate ?? 4.0,
    featured: apiProduct.id <= 5,
  };
}

export function transformAll(apiProducts) {
  return apiProducts.map(transformToFinancialProduct);
}
