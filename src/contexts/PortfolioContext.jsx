import { createContext, useContext, useState, useCallback } from 'react';
import { calculatePortfolioStats } from '../utils/finance';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [items, setItems] = useState([]); // Array of { product, amount }

  // Add a product to portfolio (default amount = minInvestment)
  const addToPortfolio = useCallback((product, amount) => {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev; // Already in portfolio
      return [...prev, { product, amount: amount || product.minInvestment }];
    });
  }, []);

  // Remove a product from portfolio
  const removeFromPortfolio = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  // Update the allocated amount for a product
  const updateAllocation = useCallback((productId, newAmount) => {
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId ? { ...i, amount: Number(newAmount) } : i
      )
    );
  }, []);

  // Check if a product is in portfolio
  const isInPortfolio = useCallback((productId) => {
    return items.some(i => i.product.id === productId);
  }, [items]);

  // Get computed portfolio statistics
  const stats = calculatePortfolioStats(items);

  return (
    <PortfolioContext.Provider value={{
      items,
      stats,
      addToPortfolio,
      removeFromPortfolio,
      updateAllocation,
      isInPortfolio,
      portfolioCount: items.length,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be inside PortfolioProvider');
  return ctx;
}
