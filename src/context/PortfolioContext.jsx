import React, { createContext, useContext, useState, useCallback } from 'react';
import { calculatePortfolioStats } from '../utils/finance';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToPortfolio = useCallback((product, amount = product.minInvestment) => {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, { ...product, allocatedAmount: amount }];
    });
  }, []);

  const removeFromPortfolio = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const updateAllocation = useCallback((productId, newAmount) => {
    setItems(prev =>
      prev.map(i => i.id === productId ? { ...i, allocatedAmount: Number(newAmount) } : i)
    );
  }, []);

  const isInPortfolio = useCallback((productId) => {
    return items.some(i => i.id === productId);
  }, [items]);

  const stats = calculatePortfolioStats(items);

  return (
    <PortfolioContext.Provider value={{
      items,
      stats,
      addToPortfolio,
      removeFromPortfolio,
      updateAllocation,
      isInPortfolio,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
