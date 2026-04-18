import React, { createContext, useContext, useState, useCallback } from "react";
import { getRecommendations } from "../utils/finance";

const UserProfileContext = createContext(null);

const DEFAULT_PROFILE = {
  riskTolerance:       "",   // conservative | moderate | aggressive
  investmentHorizon:   "",   // short | medium | long
  monthlyCapacity:     0,    // PKR
  liquidityPreference: "",   // easy | moderate | locked
  investmentGoal:      "",   // wealth | retirement | emergency | purchase
};

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("finvest-profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const updateProfile = useCallback((newProfile) => {
    setProfile(newProfile);
    try { localStorage.setItem("finvest-profile", JSON.stringify(newProfile)); } catch {}
  }, []);

  const isProfileComplete = useCallback(() => {
    return (
      !!profile.riskTolerance &&
      !!profile.investmentHorizon &&
      profile.monthlyCapacity > 0 &&
      !!profile.liquidityPreference &&
      !!profile.investmentGoal
    );
  }, [profile]);

  const getProductRecommendations = useCallback(
    (products) => getRecommendations(products, profile),
    [profile]
  );

  return (
    <UserProfileContext.Provider
      value={{ profile, updateProfile, isProfileComplete, getProductRecommendations }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be within UserProfileProvider");
  return ctx;
}
