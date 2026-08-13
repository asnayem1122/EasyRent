import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLinkActive = (path) => location.pathname === path ? 'active-dock' : '';

  return (
    <header className="dock-navbar-wrapper">
      <div className="dock-navbar">
        {/* Brand Logo Pill */}
        <Link to="/" className="dock-logo">
          <i className="fa-solid fa-house-chimney text-primary me-2"></i>
          <span>EasyRent</span>
          <span className="dock-bd-badge ms-2">🇧🇩 BD</span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="dock-nav-items">
          <Link to="/" className={`dock-item ${isLinkActive('/')}`}>
            <i className="fa-solid fa-compass me-1"></i>Explore
          </Link>
          {user && (
            <Link to="/dashboard" className={`dock-item ${isLinkActive('/dashboard')}`}>
              <i className="fa-solid fa-gauge me-1"></i>Dashboard
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="dock-actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="dock-icon-btn" title="Toggle Theme">
            {theme === 'dark'
              ? <i className="fa-solid fa-sun text-warning"></i>
              : <i className="fa-solid fa-moon"></i>}
          </button>

          {user ? (
            <div className="d-flex align-items-center gap-2">
              <span className="dock-user-badge d-none d-md-inline">
                {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="dock-btn-secondary" title="Logout">
                <i className="fa-solid fa-right-from-bracket me-1"></i>Logout
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="dock-btn-secondary">Login</Link>
              <Link to="/register" className="dock-btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
