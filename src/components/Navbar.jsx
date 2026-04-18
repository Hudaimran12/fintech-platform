import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { useUserProfile } from "../context/UserProfileContext";
import "./Navbar.css";

export default function Navbar() {
  const { items } = usePortfolio();
  const { isProfileComplete } = useUserProfile();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/",               label: "Home" },
    { to: "/products",       label: "Products" },
    { to: "/profile",        label: "My Profile" },
    { to: "/portfolio",      label: `Portfolio${items.length ? ` (${items.length})` : ""}` },
    { to: "/recommendations",label: "For You" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-logo">◈</span>
          <span>Fin<em>Vest</em></span>
        </NavLink>

        <button className="nav-hamburger" onClick={() => setOpen(o => !o)}>
          {open ? "✕" : "☰"}
        </button>

        <div className={`navbar-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {!isProfileComplete() && (
          <NavLink to="/profile" className="btn btn-copper btn-sm hide-mobile" style={{ marginLeft: "auto" }}>
            Create Profile
          </NavLink>
        )}
      </div>
    </nav>
  );
}
