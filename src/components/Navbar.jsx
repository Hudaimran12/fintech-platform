import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { useUserProfile } from '../context/UserProfileContext';
import './Navbar.css';

export default function Navbar() {
  const { items } = usePortfolio();
  const { isProfileComplete } = useUserProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/products', label: 'Products' },
    { to: '/profile', label: 'Profile' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/recommendations', label: 'Recommendations' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">◆</span>
          <span className="brand-name">FinVest</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setMenuOpen(false)}
              >
                {label}
                {label === 'Portfolio' && items.length > 0 && (
                  <span className="nav-badge">{items.length}</span>
                )}
                {label === 'Recommendations' && isProfileComplete() && (
                  <span className="nav-dot" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
