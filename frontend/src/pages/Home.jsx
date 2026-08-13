import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL } from '../config';

import { MOCK_PROPERTIES } from '../mockData';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    location: '', property_type: '', rooms: '', rent_min: '', rent_max: ''
  });
  const [activeSearch, setActiveSearch] = useState(false);

  const fetchProperties = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(searchFilters).forEach(key => {
        if (searchFilters[key]) params.append(key, searchFilters[key]);
      });
      const res = await axios.get(`/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.warn('Backend API unavailable. Using demo dataset:', err);
      // Filter mock properties for demo site
      let filtered = [...MOCK_PROPERTIES];
      if (searchFilters.location) {
        filtered = filtered.filter(p => p.location.toLowerCase().includes(searchFilters.location.toLowerCase()));
      }
      if (searchFilters.property_type) {
        filtered = filtered.filter(p => p.property_type === searchFilters.property_type);
      }
      if (searchFilters.rooms) {
        const r = parseInt(searchFilters.rooms);
        filtered = filtered.filter(p => r >= 4 ? p.rooms >= 4 : p.rooms === r);
      }
      if (searchFilters.rent_min) {
        filtered = filtered.filter(p => p.rent >= Number(searchFilters.rent_min));
      }
      if (searchFilters.rent_max) {
        filtered = filtered.filter(p => p.rent <= Number(searchFilters.rent_max));
      }
      setProperties(filtered);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (user && user.role === 'tenant') {
      try {
        const res = await axios.get('/properties/favorites');
        const favMap = {};
        res.data.forEach(p => { favMap[p.property_id] = true; });
        setFavorites(favMap);
      } catch (err) {
        const savedFavs = JSON.parse(localStorage.getItem('demo_favorites') || '{}');
        setFavorites(savedFavs);
      }
    }
  };

  useEffect(() => { fetchProperties(); }, []);
  useEffect(() => { fetchFavorites(); }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(true);
    fetchProperties(filters);
  };

  const handleResetFilters = () => {
    const reset = { location: '', property_type: '', rooms: '', rent_min: '', rent_max: '' };
    setFilters(reset);
    setActiveSearch(false);
    fetchProperties(reset);
  };

  const handleToggleFavorite = async (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'tenant') return;
    try {
      const res = await axios.post(`/properties/${propertyId}/favorite`);
      setFavorites(prev => ({ ...prev, [propertyId]: res.data.favorited }));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {/* Eyebrow */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--card-bg)', backdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)', borderRadius: '50px',
                padding: '6px 18px', marginBottom: '1.5rem',
                fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600
              }}>
                <span style={{ color: 'var(--primary-color)' }}>●</span> Bangladesh's #1 Rental Platform
              </div>

              <h1 style={{
                fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.2rem',
                color: 'var(--text-primary)'
              }}>
                Find Your Next{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                  Perfect Home
                </span>
              </h1>

              <p style={{
                fontSize: '1.15rem', color: 'var(--text-secondary)',
                maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7
              }}>
                Discover verified rental houses and flats in prime locations across Bangladesh. Simple, fast, and secure.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {!user && (
                  <>
                    <Link to="/register" className="btn btn-primary-custom" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                      <i className="fa-solid fa-rocket me-2"></i>Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-secondary-custom" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                      <i className="fa-solid fa-right-to-bracket me-2"></i>Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search Panel ── */}
      <div className="container">
        <div className="search-panel">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label-custom">
                  <i className="fa-solid fa-location-dot me-1" style={{ color: 'var(--primary-color)' }}></i> Location
                </label>
                <input
                  type="text" className="form-control form-control-custom"
                  name="location" placeholder="e.g. Dhaka, Chittagong"
                  value={filters.location} onChange={handleInputChange}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label-custom">Type</label>
                <select className="form-select form-control-custom" name="property_type"
                  value={filters.property_type} onChange={handleInputChange}>
                  <option value="">Any Type</option>
                  <option value="House">House</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label-custom">Rooms</label>
                <select className="form-select form-control-custom" name="rooms"
                  value={filters.rooms} onChange={handleInputChange}>
                  <option value="">Any</option>
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                  <option value="4">4+ Rooms</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label-custom">Budget (৳)</label>
                <div className="row g-2">
                  <div className="col-6">
                    <input type="number" className="form-control form-control-custom"
                      name="rent_min" placeholder="Min"
                      value={filters.rent_min} onChange={handleInputChange} />
                  </div>
                  <div className="col-6">
                    <input type="number" className="form-control form-control-custom"
                      name="rent_max" placeholder="Max"
                      value={filters.rent_max} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="col-md-2">
                <button type="submit" className="btn btn-primary-custom w-100" style={{ padding: '0.8rem' }}>
                  <i className="fa-solid fa-magnifying-glass me-2"></i>Search
                </button>
              </div>
            </div>

            {activeSearch && (
              <div className="text-center mt-3">
                <button type="button" onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <i className="fa-solid fa-rotate-left me-1"></i>Reset Filters
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── Property Grid ── */}
      <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>
            Featured Properties
          </h2>
          <span style={{
            background: 'var(--card-bg)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)', borderRadius: '50px',
            padding: '6px 16px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)'
          }}>
            {properties.length} listing{properties.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ color: 'var(--primary-color)', width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <i className="fa-regular fa-folder-open fa-4x" style={{ color: 'var(--text-secondary)', opacity: 0.4, marginBottom: '1.5rem' }}></i>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>No Properties Found</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Try broadening your search criteria.</p>
            <button onClick={handleResetFilters} className="btn btn-primary-custom" style={{ margin: '0 auto', padding: '0.8rem 2rem' }}>
              Browse All Properties
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {properties.map(property => {
              const hasImage = property.main_image;
              const imageSrc = hasImage ? (property.main_image.startsWith('http') ? property.main_image : `${IMAGE_BASE_URL}${property.main_image}`) : null;

              return (
                <div key={property.property_id} className="col-md-6 col-lg-4">
                  <div className="property-card">
                    <div className="property-img-wrapper">
                      <span className="property-badge-type">{property.property_type}</span>
                      <span className={`property-badge-status ${property.status === 'Available' ? 'bg-success' : 'bg-secondary'}`}>
                        {property.status}
                      </span>
                      <span className="property-badge-rent">৳{Number(property.rent).toLocaleString()}/mo</span>

                      {hasImage ? (
                        <img src={imageSrc} className="property-img" alt={property.title} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, var(--glass-bg), var(--card-bg))',
                          color: 'var(--text-secondary)'
                        }}>
                          <i className="fa-regular fa-image fa-3x" style={{ opacity: 0.4 }}></i>
                        </div>
                      )}

                      {(!user || user.role === 'tenant') && (
                        <button
                          onClick={(e) => handleToggleFavorite(property.property_id, e)}
                          className={`favorite-btn ${favorites[property.property_id] ? 'active' : ''}`}
                          title={favorites[property.property_id] ? 'Remove Favorite' : 'Add Favorite'}
                        >
                          <i className={`fa-heart ${favorites[property.property_id] ? 'fa-solid' : 'fa-regular'}`}></i>
                        </button>
                      )}
                    </div>

                    <div className="property-body">
                      <h3 className="property-title">
                        <Link to={`/property/${property.property_id}`}>{property.title}</Link>
                      </h3>
                      <div className="property-location">
                        <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-color)' }}></i>{' '}
                        {property.location}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                        {property.description.length > 90
                          ? `${property.description.substring(0, 90)}...`
                          : property.description}
                      </p>
                      <div className="property-amenities">
                        <span><i className="fa-solid fa-bed me-1" style={{ color: 'var(--primary-color)' }}></i>{property.rooms} Rooms</span>
                        <span><i className="fa-solid fa-bath me-1" style={{ color: 'var(--primary-color)' }}></i>{property.bathrooms} Bathrooms</span>
                      </div>
                      <Link to={`/property/${property.property_id}`} className="btn btn-secondary-custom w-100 mt-3" style={{ padding: '0.7rem' }}>
                        <i className="fa-solid fa-circle-info me-1"></i>View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
