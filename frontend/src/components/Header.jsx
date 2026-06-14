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

  const isLinkActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
          <i className="fa-solid fa-house-chimney" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
          Easy Rent
        </Link>

        <div className="d-flex align-items-center gap-3">
          <ul className="navbar-nav d-flex flex-row gap-1 mb-0 list-unstyled me-2">
            <li className="nav-item">
              <Link className={`nav-link-custom ${isLinkActive('/')}`} to="/">Home</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Dark/Light Mode"
              style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--glass-border)',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
              }}
            >
              {theme === 'dark'
                ? <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i>
                : <i className="fa-solid fa-moon"></i>}
            </button>

            {user ? (
              <>
                <span className="text-muted d-none d-md-inline small" style={{ color: 'var(--text-secondary)' }}>
                  Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong>
                </span>
                <Link to="/dashboard" className="btn btn-primary-custom btn-sm">
                  <i className="fa-solid fa-gauge"></i> Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary-custom btn-sm">
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary-custom btn-sm">
                  <i className="fa-solid fa-right-to-bracket"></i> Login
                </Link>
                <Link to="/register" className="btn btn-primary-custom btn-sm">
                  <i className="fa-solid fa-user-plus"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
