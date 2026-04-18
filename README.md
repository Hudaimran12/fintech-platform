# FinVest — Dynamic Financial Product Discovery Platform

**Student Name:** [Your Name]  
**Roll Number:** [Your Roll Number]  
**Course:** Web Programming — BS FinTech, FAST-NUCES Islamabad  
**Instructor:** Arsalan Khan

---

## Live Demo
- Frontend: `https://finvest.vercel.app` ← replace after deployment

---

## Features

| Feature | Status |
|---------|--------|
| Home page with dynamic featured products | ✅ |
| Product listing with 6 filters (AND logic) | ✅ |
| Product detail with dynamic route `/product/:id` | ✅ |
| Decision insight generation (dynamic, not hardcoded) | ✅ |
| Return projection calculator | ✅ |
| Product comparison (side-by-side) | ✅ |
| User financial profile form (all 5 fields) | ✅ |
| Recommendation engine (profile → products) | ✅ |
| Portfolio system (add/remove/allocate) | ✅ |
| Weighted return & risk distribution calculations | ✅ |
| API integration (Fake Store API + transformation) | ✅ |
| Deterministic data transformation | ✅ |
| PortfolioContext + UserProfileContext | ✅ |
| React Router v6 with all 6 routes + 404 | ✅ |
| CSS animations (hover, add feedback, page fade) | ✅ |
| Responsive design (mobile/tablet/desktop) | ✅ |
| LocalStorage profile persistence | ✅ |
| Sort options (return, risk, investment) | ✅ |
| Search by product name | ✅ |
| Diversification score | ✅ |
| High-risk portfolio warning (>70%) | ✅ |

---

## How to Run Locally

```bash
npm install
npm run dev
```
Open `http://localhost:3000`

---

## Project Structure

```
src/
├── App.jsx                          # Root with all routes
├── main.jsx
├── styles/global.css                # Full design system + CSS variables
├── utils/
│   ├── transform.js                 # API → financial product transformation
│   └── finance.js                   # Recommendation engine, portfolio calc, formatPKR
├── context/
│   ├── PortfolioContext.jsx         # Global portfolio state
│   └── UserProfileContext.jsx       # Global user profile state
├── hooks/
│   └── useProducts.js              # Fetch + transform API data
├── components/
│   ├── Navbar.jsx                  # Sticky nav with portfolio count
│   ├── ProductCard.jsx             # Card with hover reveal animation
│   ├── FilterPanel.jsx             # All 6 filter controls
│   ├── RiskBadge.jsx               # Color-coded risk badge
│   ├── ReturnDisplay.jsx           # Formatted return percentage
│   ├── ProfileForm.jsx             # Controlled profile form
│   ├── PortfolioComponents.jsx     # PortfolioSummary + PortfolioItem
│   └── RecommendationList.jsx      # Filtered product grid
└── pages/
    ├── Home.jsx                    # Landing page
    ├── ProductListing.jsx          # All products + filters
    ├── ProductDetail.jsx           # Dynamic route /product/:id
    ├── UserProfile.jsx             # Profile form page
    ├── Portfolio.jsx               # Portfolio management
    ├── Recommendations.jsx         # Personalized recommendations
    └── NotFound.jsx                # 404 page
```

---

## Financial Logic Explained

### Data Transformation (deterministic)
Raw Fake Store API products are mapped to financial instruments using fixed category mappings. The `expectedReturn` uses a prime-number seed (`id * 7919 % 100`) so the same product always gets the same return — no randomness on re-render.

### Recommendation Engine
```
conservative → [low risk] products only
moderate     → [low, medium risk] products
aggressive   → [low, medium, high risk] products

Short horizon  → short time-horizon products only
Medium horizon → short + medium products
Long horizon   → all time-horizon products

Easy liquidity   → easy only
Moderate liquidity → easy + moderate
Locked liquidity → all liquidity types

Then filter by monthlyCapacity >= product.minInvestment
Then sort: conservative = lowest return first, aggressive = highest return first
```

### Portfolio Calculations
- **Total Invested** = sum of all allocatedAmounts
- **Weighted Return** = Σ (allocation/total × expectedReturn)
- **Risk Distribution** = % of total invested in each risk tier
- **Diversification Score** = (number of categories / 4) × 100

---

## API Integration

Uses **Fake Store API** (`https://fakestoreapi.com/products`).

| API Category | Financial Category | Risk | Liquidity | Horizon |
|---|---|---|---|---|
| electronics | investment | medium | moderate | long |
| jewelery | savings | low | easy | short |
| men's clothing | insurance | low | locked | long |
| women's clothing | crypto | high | easy | long |

---

## Component Hierarchy

```
App
├── UserProfileProvider (Context)
│   └── PortfolioProvider (Context)
│       ├── Navbar (portfolioCount, currentRoute)
│       └── Routes
│           ├── Home → ProductCard, RiskBadge, ReturnDisplay
│           ├── ProductListing → FilterPanel, ProductCard
│           ├── ProductDetail → RiskBadge, ReturnDisplay
│           ├── UserProfile → ProfileForm
│           ├── Portfolio → PortfolioSummary, PortfolioItem
│           ├── Recommendations → RecommendationList → ProductCard
│           └── NotFound
```
