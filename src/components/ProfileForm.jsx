import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import './ProfileForm.css';

const RISK_OPTIONS = [
  { value: 'conservative', label: 'Conservative', desc: 'Preserve capital, minimal risk', icon: '🛡️' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced growth and stability', icon: '⚖️' },
  { value: 'aggressive', label: 'Aggressive', desc: 'Maximum growth, high risk tolerance', icon: '🚀' },
];
const HORIZON_OPTIONS = [
  { value: 'short', label: 'Short (1–2 years)', icon: '⚡' },
  { value: 'medium', label: 'Medium (3–5 years)', icon: '📅' },
  { value: 'long', label: 'Long (5+ years)', icon: '🌱' },
];
const LIQUIDITY_OPTIONS = [
  { value: 'easy', label: 'Need quick access', desc: 'Funds accessible anytime' },
  { value: 'moderate', label: 'Some flexibility', desc: 'Can wait weeks/months' },
  { value: 'locked', label: 'Can lock funds', desc: 'Committed for the full term' },
];
const GOAL_OPTIONS = ['Wealth building', 'Retirement', 'Emergency fund', 'Specific purchase', 'Education', 'Passive income'];

export default function ProfileForm({ onSaved }) {
  const { profile, updateProfile } = useUserProfile();
  const [form, setForm] = useState({ ...profile });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm({ ...profile }); }, [profile]);

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.riskTolerance) e.riskTolerance = 'Please select your risk tolerance.';
    if (!form.investmentHorizon) e.investmentHorizon = 'Please select your investment horizon.';
    if (!form.monthlyCapacity || Number(form.monthlyCapacity) < 1000) e.monthlyCapacity = 'Minimum monthly capacity is PKR 1,000.';
    if (!form.liquidityPreference) e.liquidityPreference = 'Please select a liquidity preference.';
    if (!form.investmentGoal) e.investmentGoal = 'Please select an investment goal.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    updateProfile({ ...form, monthlyCapacity: Number(form.monthlyCapacity) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    onSaved?.();
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      {/* Risk Tolerance */}
      <div className="form-group">
        <label className="form-label">Risk Tolerance *</label>
        <div className="radio-cards">
          {RISK_OPTIONS.map(o => (
            <label key={o.value} className={`radio-card ${form.riskTolerance === o.value ? 'selected' : ''}`}>
              <input type="radio" name="riskTolerance" value={o.value}
                checked={form.riskTolerance === o.value}
                onChange={() => set('riskTolerance', o.value)} />
              <span className="rc-icon">{o.icon}</span>
              <span className="rc-label">{o.label}</span>
              <span className="rc-desc">{o.desc}</span>
            </label>
          ))}
        </div>
        {errors.riskTolerance && <span className="form-error">{errors.riskTolerance}</span>}
      </div>

      {/* Investment Horizon */}
      <div className="form-group">
        <label className="form-label">Investment Horizon *</label>
        <div className="radio-pills">
          {HORIZON_OPTIONS.map(o => (
            <label key={o.value} className={`radio-pill ${form.investmentHorizon === o.value ? 'selected' : ''}`}>
              <input type="radio" name="investmentHorizon" value={o.value}
                checked={form.investmentHorizon === o.value}
                onChange={() => set('investmentHorizon', o.value)} />
              {o.icon} {o.label}
            </label>
          ))}
        </div>
        {errors.investmentHorizon && <span className="form-error">{errors.investmentHorizon}</span>}
      </div>

      {/* Monthly Capacity */}
      <div className="form-group">
        <label className="form-label">Monthly Investment Capacity (PKR) *</label>
        <input
          type="number" min={1000} step={500}
          className={`form-input ${errors.monthlyCapacity ? 'input-error' : ''}`}
          placeholder="e.g. 25000"
          value={form.monthlyCapacity}
          onChange={e => set('monthlyCapacity', e.target.value)}
        />
        <span className="form-hint">This filters products by minimum investment amount.</span>
        {errors.monthlyCapacity && <span className="form-error">{errors.monthlyCapacity}</span>}
      </div>

      {/* Liquidity Preference */}
      <div className="form-group">
        <label className="form-label">Liquidity Preference *</label>
        <div className="liq-cards">
          {LIQUIDITY_OPTIONS.map(o => (
            <label key={o.value} className={`liq-card ${form.liquidityPreference === o.value ? 'selected' : ''}`}>
              <input type="radio" name="liquidityPreference" value={o.value}
                checked={form.liquidityPreference === o.value}
                onChange={() => set('liquidityPreference', o.value)} />
              <span className="liq-label">{o.label}</span>
              <span className="liq-desc">{o.desc}</span>
            </label>
          ))}
        </div>
        {errors.liquidityPreference && <span className="form-error">{errors.liquidityPreference}</span>}
      </div>

      {/* Investment Goal */}
      <div className="form-group">
        <label className="form-label">Primary Investment Goal *</label>
        <select className={`form-select ${errors.investmentGoal ? 'input-error' : ''}`}
          value={form.investmentGoal}
          onChange={e => set('investmentGoal', e.target.value)}>
          <option value="">-- Select a goal --</option>
          {GOAL_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        {errors.investmentGoal && <span className="form-error">{errors.investmentGoal}</span>}
      </div>

      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
        {saved ? '✓ Profile Saved!' : 'Save Profile & Get Recommendations'}
      </button>
    </form>
  );
}
