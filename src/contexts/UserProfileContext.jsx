import { createContext, useContext, useState, useCallback } from 'react';
import { getRecommendations } from '../utils/finance';

const UserProfileContext = createContext();

const INITIAL_PROFILE = {
  riskTolerance:       '',   // 'conservative' | 'moderate' | 'aggressive'
  investmentHorizon:   '',   // 'short' | 'medium' | 'long'
  monthlyCapacity:     '',   // number (PKR)
  liquidityPreference: '',   // 'easy' | 'moderate' | 'locked'
  investmentGoal:      '',   // string
};

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    // Persist profile in localStorage
    try {
      const saved = localStorage.getItem('finvault_profile');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const updateProfile = useCallback((newProfile) => {
    setProfile(newProfile);
    try { localStorage.setItem('finvault_profile', JSON.stringify(newProfile)); } catch {}
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    try { localStorage.removeItem('finvault_profile'); } catch {}
  }, []);

  const isProfileComplete = useCallback(() => {
    if (!profile) return false;
    return !!(
      profile.riskTolerance &&
      profile.investmentHorizon &&
      profile.monthlyCapacity &&
      profile.liquidityPreference &&
      profile.investmentGoal
    );
  }, [profile]);

  // Compute recommendations from any product list
  const computeRecommendations = useCallback((products) => {
    if (!profile || !isProfileComplete()) return [];
    return getRecommendations(products, profile);
  }, [profile, isProfileComplete]);

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      clearProfile,
      isProfileComplete,
      computeRecommendations,
      INITIAL_PROFILE,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be inside UserProfileProvider');
  return ctx;
}
