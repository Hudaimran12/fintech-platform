import React, { useState } from "react";
import "./ProfileForm.css";

const GOALS = ["Wealth Building", "Retirement", "Emergency Fund", "Specific Purchase"];

/**
 * ProfileForm — controlled form for user financial profile
 * Props: profile, onSubmit, onChange
 */
export default function ProfileForm({ profile, onSubmit }) {
  const [form, setForm] = useState({
    riskTolerance:       profile?.riskTolerance       || "",
    investmentHorizon:   profile?.investmentHorizon   || "",
    monthlyCapacity:     profile?.monthlyCapacity     || "",
    liquidityPreference: profile?.liquidityPreference || "",
    investmentGoal:      profile?.investmentGoal      || "",
  });
  const [errors, setErrors] = useState({});

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.riskTolerance)       errs.riskTolerance       = "Please select your risk tolerance";
    if (!form.investmentHorizon)   errs.investmentHorizon   = "Please select your investment horizon";
    if (!form.monthlyCapacity || parseFloat(form.monthlyCapacity) < 1000)
                                   errs.monthlyCapacity     = "Minimum monthly capacity is PKR 1,000";
    if (!form.liquidityPreference) errs.liquidityPreference = "Please select your liquidity preference";
    if (!form.investmentGoal)      errs.investmentGoal      = "Please select an investment goal";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ ...form, monthlyCapacity: parseFloat(form.monthlyCapacity) });
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {/* Risk Tolerance */}
      <div className="pf-section">
        <label className="pf-section-label">Risk Tolerance</label>
        <p className="pf-section-desc">How much market volatility can you handle?</p>
        <div className="radio-group">
          {[
            { val: "conservative", label: "Conservative", desc: "Capital preservation first, low risk", icon: "🛡️" },
            { val: "moderate",     label: "Moderate",     desc: "Balance between growth and safety",   icon: "⚖️" },
            { val: "aggressive",   label: "Aggressive",   desc: "Maximum growth, high risk tolerance",  icon: "🚀" },
          ].map(opt => (
            <label key={opt.val} className={`radio-card ${form.riskTolerance === opt.val ? "selected" : ""}`}>
              <input type="radio" name="riskTolerance" value={opt.val}
                checked={form.riskTolerance === opt.val}
                onChange={() => set("riskTolerance", opt.val)} />
              <span className="rc-icon">{opt.icon}</span>
              <span className="rc-label">{opt.label}</span>
              <span className="rc-desc">{opt.desc}</span>
            </label>
          ))}
        </div>
        {errors.riskTolerance && <span className="error-msg">{errors.riskTolerance}</span>}
      </div>

      {/* Investment Horizon */}
      <div className="pf-section">
        <label className="pf-section-label">Investment Horizon</label>
        <p className="pf-section-desc">How long can you keep your money invested?</p>
        <div className="radio-group">
          {[
            { val: "short",  label: "Short",  desc: "1–2 years",  icon: "⏱️" },
            { val: "medium", label: "Medium", desc: "3–5 years",  icon: "📅" },
            { val: "long",   label: "Long",   desc: "5+ years",   icon: "🗓️" },
          ].map(opt => (
            <label key={opt.val} className={`radio-card ${form.investmentHorizon === opt.val ? "selected" : ""}`}>
              <input type="radio" name="investmentHorizon" value={opt.val}
                checked={form.investmentHorizon === opt.val}
                onChange={() => set("investmentHorizon", opt.val)} />
              <span className="rc-icon">{opt.icon}</span>
              <span className="rc-label">{opt.label}</span>
              <span className="rc-desc">{opt.desc}</span>
            </label>
          ))}
        </div>
        {errors.investmentHorizon && <span className="error-msg">{errors.investmentHorizon}</span>}
      </div>

      {/* Monthly Capacity */}
      <div className="pf-section">
        <label className="pf-section-label">Monthly Investment Capacity (PKR)</label>
        <p className="pf-section-desc">How much can you invest each month? (Min: PKR 1,000)</p>
        <div className="input-group">
          <input
            type="number"
            placeholder="e.g. 25000"
            value={form.monthlyCapacity}
            onChange={e => set("monthlyCapacity", e.target.value)}
            min={1000}
          />
        </div>
        {errors.monthlyCapacity && <span className="error-msg">{errors.monthlyCapacity}</span>}
      </div>

      {/* Liquidity Preference */}
      <div className="pf-section">
        <label className="pf-section-label">Liquidity Preference</label>
        <p className="pf-section-desc">How quickly might you need access to your funds?</p>
        <div className="radio-group">
          {[
            { val: "easy",     label: "Quick Access",    desc: "May need funds anytime",          icon: "💧" },
            { val: "moderate", label: "Some Flexibility", desc: "Can wait a few months",          icon: "🌊" },
            { val: "locked",   label: "Can Lock Funds",  desc: "Long-term commitment is fine",    icon: "🔒" },
          ].map(opt => (
            <label key={opt.val} className={`radio-card ${form.liquidityPreference === opt.val ? "selected" : ""}`}>
              <input type="radio" name="liquidityPreference" value={opt.val}
                checked={form.liquidityPreference === opt.val}
                onChange={() => set("liquidityPreference", opt.val)} />
              <span className="rc-icon">{opt.icon}</span>
              <span className="rc-label">{opt.label}</span>
              <span className="rc-desc">{opt.desc}</span>
            </label>
          ))}
        </div>
        {errors.liquidityPreference && <span className="error-msg">{errors.liquidityPreference}</span>}
      </div>

      {/* Investment Goal */}
      <div className="pf-section">
        <label className="pf-section-label">Investment Goal</label>
        <div className="input-group">
          <select value={form.investmentGoal} onChange={e => set("investmentGoal", e.target.value)}>
            <option value="">— Select your primary goal —</option>
            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        {errors.investmentGoal && <span className="error-msg">{errors.investmentGoal}</span>}
      </div>

      <button type="submit" className="btn btn-copper btn-lg" style={{ width: "100%", justifyContent: "center" }}>
        Save Financial Profile →
      </button>
    </form>
  );
}
