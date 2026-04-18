import React, { createContext, useContext, useState, useCallback } from "react";
import { calculatePortfolioStats } from "../utils/finance";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [items, setItems] = useState([]); // [{ product, allocatedAmount }]

  /** Add a product to portfolio with a default allocation */
  const addToPortfolio = useCallback((product, amount = product.minInvestment) => {
    setItems((prev) => {
      if (prev.find((i) => i.product.id === product.id)) return prev;
      return [...prev, { product, allocatedAmount: amount }];
    });
  }, []);

  /** Remove a product from portfolio */
  const removeFromPortfolio = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  /** Update allocated amount for a portfolio item */
  const updateAllocation = useCallback((productId, newAmount) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? { ...i, allocatedAmount: Math.max(0, newAmount) }
          : i
      )
    );
  }, []);

  /** Check if a product is already in portfolio */
  const isInPortfolio = useCallback(
    (productId) => items.some((i) => i.product.id === productId),
    [items]
  );

  /** Derived portfolio statistics */
  const stats = calculatePortfolioStats(items);

  return (
    <PortfolioContext.Provider
      value={{
        items,
        stats,
        addToPortfolio,
        removeFromPortfolio,
        updateAllocation,
        isInPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be within PortfolioProvider");
  return ctx;
}
