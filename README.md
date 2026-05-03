# FinVest — Dynamic Financial Product Discovery Platform

A comprehensive React-based web application built for the FAST University BS FinTech Web Programming course.

---

## Features

- **Home Page** — Hero, stats, category navigation, featured products (best-return per category, dynamically selected)
- **Product Listing** — All 20 products with 6 simultaneous AND-logic filters + 4 sort options
- **Product Detail** — Full attributes, dynamic decision insights, return projection calculator, side-by-side product comparison
- **User Financial Profile** — Controlled form with full validation, drives all recommendations
- **Portfolio** — Add/remove/edit allocations, weighted return, risk distribution, diversification score
- **Recommendations** — Dynamically computed from profile; zero hardcoded product lists

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18 + React Router v6 |
| State | `useState` + Context API (PortfolioContext, UserProfileContext) |
| Data | Fake Store API → custom deterministic transformer |
| Styling | Plain CSS (no UI libraries) |
| Bundler | Vite |

---

## Setup & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx / .css
│   ├── ProductCard.jsx / .css
│   ├── FilterPanel.jsx / .css
│   ├── RiskBadge.jsx
│   ├── ReturnDisplay.jsx
│   ├── PortfolioSummary.jsx / .css
│   ├── PortfolioItem.jsx / .css
│   ├── ProfileForm.jsx / .css
│   ├── RecommendationList.jsx / .css
├── context/
│   ├── PortfolioContext.jsx
│   └── UserProfileContext.jsx
├── hooks/
│   └── useProducts.js
├── pages/
│   ├── Home.jsx / .css
│   ├── ProductListing.jsx / .css
│   ├── ProductDetail.jsx / .css
│   ├── UserProfile.jsx / .css
│   ├── Portfolio.jsx / .css
│   ├── Recommendations.jsx / .css
│   └── NotFound.jsx
├── utils/
│   ├── finance.js      ← recommendation engine, portfolio math, projections
│   └── transform.js    ← deterministic API → FinTech product transformer
├── App.jsx
├── main.jsx
└── global.css
```

---

## Financial Logic

### Data Transformation (`utils/transform.js`)
Raw Fake Store API products are transformed via **deterministic mappings** — same API product always yields identical financial attributes:

| API Category | FinTech Category | Risk | Return Range |
|---|---|---|---|
| electronics | investment | medium | 7–13% |
| jewelery | savings | low | 3–7% |
| men's clothing | insurance | low | 3–7% |
| women's clothing | crypto | high | 13–28% |

### Recommendation Engine (`utils/finance.js`)
Profile fields map to allowed product attributes via **inclusive range logic**:

```
conservative → only low risk
moderate     → low + medium risk
aggressive   → low + medium + high risk

short horizon  → short-term products only
medium horizon → short + medium products
long horizon   → all time horizons

easy liquidity preference → easy products only
moderate preference       → easy + moderate
locked preference         → all liquidity types
```

Products that pass all 4 filters (risk, horizon, liquidity, budget) are returned. Sort order: conservative → lowest risk first; others → highest return first.

### Portfolio Calculations
- **Total Invested** = sum of all allocated amounts
- **Weighted Return** = Σ (allocation / total) × product.expectedReturn
- **Risk Distribution** = % of total in each risk bucket
- **Diversification Score** = f(distinct categories, risk levels, product count), capped at 100

---

## Component Hierarchy

```
App
├── Navbar (reads PortfolioContext, UserProfileContext)
└── Routes
    ├── Home → ProductCard[]
    ├── ProductListing → FilterPanel + ProductCard[]
    ├── ProductDetail → RiskBadge, ReturnDisplay
    ├── UserProfile → ProfileForm
    ├── Portfolio → PortfolioSummary + PortfolioItem[]
    └── Recommendations → RecommendationList → ProductCard[]
```

---

## API Integration

**Source:** [Fake Store API](https://fakestoreapi.com/products) — 20 products across 4 categories.

The `transformToFinancialProduct()` function in `utils/transform.js` maps every raw product to a financial instrument with consistent `riskLevel`, `expectedReturn`, `liquidity`, and `timeHorizon` using category-based deterministic rules. `Math.sin(id)`-based seeded random ensures the same product always gets the same return value across renders.

---

## Deployment

Deploy to Vercel in one command:
```bash
npm install -g vercel
vercel
```

---

*Built for FAST University — BS Financial Technology — Web Programming*
