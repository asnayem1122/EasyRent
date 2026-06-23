import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirm_password: '', role: 'tenant'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, phone, password, confirm_password, role } = formData;
    if (!name || !email || !phone || !password || !role) { setError('All fields are required.'); return; }
    if (password !== confirm_password) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const result = await register(name, email, phone, password, role);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const inputStyle = { marginBottom: '1.2rem' };

  return (
    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        <div className="card" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', fontSize: '1.5rem', color: 'var(--primary-color)'
            }}>
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>Join Easy Rent — find or list properties today</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fa-solid fa-triangle-exclamation me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label-custom">Full Name</label>
                <input type="text" className="form-control form-control-custom" name="name"
                  value={formData.name} onChange={handleInputChange} required placeholder="Your Full Name" />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label-custom">Email Address</label>
                <input type="email" className="form-control form-control-custom" name="email"
                  value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label-custom">Phone Number</label>
                <input type="text" className="form-control form-control-custom" name="phone"
                  value={formData.phone} onChange={handleInputChange} required placeholder="+8801xxxxxxxxx" />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label-custom">Register As</label>
                  <select className="form-select form-control-custom" name="role"
                    value={formData.role} onChange={handleInputChange} required>
                    <option value="tenant">Tenant (Search & Rent)</option>
                    <option value="owner">Property Owner (List & Lease)</option>
                  </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label-custom">Password</label>
                <input type="password" className="form-control form-control-custom" name="password"
                  value={formData.password} onChange={handleInputChange} required placeholder="••••••••" />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label-custom">Confirm Password</label>
                <input type="password" className="form-control form-control-custom" name="confirm_password"
                  value={formData.confirm_password} onChange={handleInputChange} required placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary-custom w-100" style={{ padding: '0.9rem' }}>
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Creating account...</>
                : <><i className="fa-solid fa-user-plus me-2"></i>Create Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Sign in here</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
