import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const handleQuickLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Card */}
        <div className="card" style={{ padding: '2.5rem', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem', color: 'var(--primary-color)'
            }}>
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>Welcome back</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>Sign in to your Easy Rent account</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fa-solid fa-triangle-exclamation me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label className="form-label-custom">Email Address</label>
              <input
                type="email"
                className="form-control form-control-custom"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>

            <div style={{ marginBottom: '1.8rem' }}>
              <label className="form-label-custom">Password</label>
              <input
                type="password"
                className="form-control form-control-custom"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary-custom w-100" style={{ padding: '0.9rem' }}>
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Signing in...</>
                : <><i className="fa-solid fa-arrow-right-to-bracket me-2"></i>Sign In</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Register here</Link>
          </div>
        </div>

        {/* Quick Login */}
        <div className="card" style={{ padding: '1.2rem 1.5rem', marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem' }}>
            🚀 <strong>Quick login for testing</strong>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Admin', email: 'admin@easyrent.com', pass: 'admin123' },
              { label: 'Owner', email: 'owner@easyrent.com', pass: 'owner123' },
              { label: 'Tenant', email: 'tenant@easyrent.com', pass: 'tenant123' },
            ].map(acc => (
              <button
                key={acc.label}
                onClick={() => handleQuickLogin(acc.email, acc.pass)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem',
                  border: '1px solid var(--glass-border)', background: 'var(--glass-bg)',
                  color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
