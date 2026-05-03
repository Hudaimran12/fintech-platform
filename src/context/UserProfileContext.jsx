import React, { createContext, useContext, useState, useCallback } from 'react';
import { getRecommendations } from '../utils/finance';

const UserProfileContext = createContext(null);

const DEFAULT_PROFILE = {
  riskTolerance: '',
  investmentHorizon: '',
  monthlyCapacity: '',
  liquidityPreference: '',
  investmentGoal: '',
};

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  const updateProfile = useCallback((newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  const isProfileComplete = useCallback(() => {
    return !!(
      profile.riskTolerance &&
      profile.investmentHorizon &&
      profile.monthlyCapacity &&
      profile.liquidityPreference &&
      profile.investmentGoal
    );
  }, [profile]);

  const getProductRecommendations = useCallback((products) => {
    return getRecommendations(products, profile);
  }, [profile]);

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      resetProfile,
      isProfileComplete,
      getProductRecommendations,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
