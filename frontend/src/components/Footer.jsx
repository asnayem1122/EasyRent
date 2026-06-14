import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container text-center">
        <div style={{ marginBottom: '0.5rem' }}>
          <i className="fa-solid fa-house-chimney me-2" style={{ color: 'var(--primary-color)' }}></i>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Easy Rent</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Easy Rent — Making rentals simple, fast, and secure.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
