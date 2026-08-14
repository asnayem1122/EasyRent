import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL } from '../config';
import { MOCK_PROPERTIES } from '../mockData';

import PropertyCard from '../components/PropertyCard';
import CompareDrawer from '../components/CompareDrawer';
import MapView from '../components/MapView';
import Toast from '../components/Toast';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  // New UI states
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategoryPill, setSelectedCategoryPill] = useState('all');
  const [compareList, setCompareList] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [filters, setFilters] = useState({
    location: '', property_type: '', rooms: '', rent_min: '', rent_max: ''
  });
  const [activeSearch, setActiveSearch] = useState(false);

  const addToast = (message, icon = 'fa-solid fa-circle-check', color = 'var(--primary-color)') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, icon, color }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

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
      console.warn('Backend API unavailable. Using BD demo dataset:', err);
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
    addToast('Search filters applied!', 'fa-solid fa-magnifying-glass');
  };

  const handleResetFilters = () => {
    const reset = { location: '', property_type: '', rooms: '', rent_min: '', rent_max: '' };
    setFilters(reset);
    setActiveSearch(false);
    setSelectedCategoryPill('all');
    fetchProperties(reset);
    addToast('Search filters reset', 'fa-solid fa-rotate-left');
  };

  const handleToggleFavorite = async (propertyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'tenant') return;

    try {
      const res = await axios.post(`/properties/${propertyId}/favorite`);
      setFavorites(prev => ({ ...prev, [propertyId]: res.data.favorited }));
      addToast(res.data.favorited ? 'Saved to Favorites ❤️' : 'Removed from Favorites', 'fa-solid fa-heart', '#fb7185');
    } catch (err) {
      const savedFavs = JSON.parse(localStorage.getItem('demo_favorites') || '{}');
      const isCurrentlyFav = !!savedFavs[propertyId];
      savedFavs[propertyId] = !isCurrentlyFav;
      localStorage.setItem('demo_favorites', JSON.stringify(savedFavs));
      setFavorites({ ...savedFavs });
      addToast(!isCurrentlyFav ? 'Saved to Favorites ❤️' : 'Removed from Favorites', 'fa-solid fa-heart', '#fb7185');
    }
  };

  const handleToggleCompare = (property) => {
    const exists = compareList.some(p => p.property_id === property.property_id);
    if (exists) {
      setCompareList(prev => prev.filter(p => p.property_id !== property.property_id));
      addToast(`Removed ${property.title.substring(0, 20)}... from comparison`, 'fa-solid fa-minus');
    } else {
      if (compareList.length >= 3) {
        addToast('You can compare a maximum of 3 properties!', 'fa-solid fa-triangle-exclamation', 'var(--secondary-color)');
        return;
      }
      setCompareList(prev => [...prev, property]);
      addToast(`Added to Compare (${compareList.length + 1}/3)`, 'fa-solid fa-code-compare');
    }
  };

  // Category Pill Filter
  const categoryFilteredProperties = properties.filter(p => {
    if (selectedCategoryPill === 'titas') return p.gas_supply === 'Titas Line Gas';
    if (selectedCategoryPill === 'metro') return p.metro_distance && p.metro_distance.toLowerCase().includes('metro');
    if (selectedCategoryPill === 'bachelor') return p.tenant_category && p.tenant_category.toLowerCase().includes('bachelor');
    if (selectedCategoryPill === 'villas') return p.property_type === 'House';
    return true;
  });

  // Sort property list
  const sortedProperties = [...categoryFilteredProperties].sort((a, b) => {
    if (sortBy === 'price-asc') return a.rent - b.rent;
    if (sortBy === 'price-desc') return b.rent - a.rent;
    if (sortBy === 'rooms') return b.rooms - a.rooms;
    return 0;
  });

  return (
    <div>
      <Toast toasts={toasts} />

      {/* ── Hero Section ── */}
      <section className="hero-section text-center position-relative pt-4">
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
                <span className="pulse-dot" style={{ color: '#10b981' }}>●</span> Bangladesh's Premier Rental Platform
              </div>


              <h1 style={{
                fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.2rem',
                color: 'var(--text-primary)'
              }}>
                Find Your Sanctuary in{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--primary-color), #10b981)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                  Bangladesh
                </span>
              </h1>

              <p style={{
                fontSize: '1.15rem', color: 'var(--text-secondary)',
                maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7
              }}>
                Verified flats and houses with Titas gas line, 24/7 generator backup, Metro Rail proximity, and transparent service charges in Dhaka, Chittagong & Sylhet.
              </p>

              {/* Floating Pill Badges */}
              <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                <span className="badge bg-white bg-opacity-50 text-dark border px-3 py-2 rounded-pill shadow-sm">
                  🔥 Titas Line Gas Verified
                </span>
                <span className="badge bg-white bg-opacity-50 text-dark border px-3 py-2 rounded-pill shadow-sm">
                  🚆 MRT Metro Station Near
                </span>
                <span className="badge bg-white bg-opacity-50 text-dark border px-3 py-2 rounded-pill shadow-sm">
                  🛡️ 100% DMP Verification Ready
                </span>
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
                  name="location" placeholder="e.g. Gulshan, Dhanmondi, Uttara"
                  value={filters.location} onChange={handleInputChange}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label-custom">Type</label>
                <select className="form-select form-control-custom" name="property_type"
                  value={filters.property_type} onChange={handleInputChange}>
                  <option value="">Any Type</option>
                  <option value="Flat">Flat</option>
                  <option value="House">House / Villa</option>
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

        {/* ── Category Quick Filter Pills (nor.ma style) ── */}
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap mt-4">
          <button
            onClick={() => setSelectedCategoryPill('all')}
            className={`btn btn-sm rounded-pill px-3 py-1.5 ${selectedCategoryPill === 'all' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
          >
            All Listings
          </button>
          <button
            onClick={() => setSelectedCategoryPill('titas')}
            className={`btn btn-sm rounded-pill px-3 py-1.5 ${selectedCategoryPill === 'titas' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
          >
            🔥 Titas Line Gas
          </button>
          <button
            onClick={() => setSelectedCategoryPill('metro')}
            className={`btn btn-sm rounded-pill px-3 py-1.5 ${selectedCategoryPill === 'metro' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
          >
            🚆 Near Metro Rail
          </button>
          <button
            onClick={() => setSelectedCategoryPill('bachelor')}
            className={`btn btn-sm rounded-pill px-3 py-1.5 ${selectedCategoryPill === 'bachelor' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
          >
            🎓 Bachelor Friendly
          </button>
          <button
            onClick={() => setSelectedCategoryPill('villas')}
            className={`btn btn-sm rounded-pill px-3 py-1.5 ${selectedCategoryPill === 'villas' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
          >
            🏡 Luxury Duplex Villas
          </button>
        </div>
      </div>

      {/* ── Toolbar: View Mode & Sorting ── */}
      <div className="container" id="featured-listings" style={{ marginTop: '3.5rem', marginBottom: '4rem' }}>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.75rem', color: 'var(--text-primary)' }}>
              Featured Listings in Bangladesh
            </h2>
            <span style={{
              background: 'var(--card-bg)', backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)', borderRadius: '50px',
              padding: '4px 14px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)'
            }}>
              {sortedProperties.length} listing{sortedProperties.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* Sort Dropdown */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted fw-bold">Sort:</span>
              <select
                className="form-select form-select-sm form-control-custom"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="default">Featured First</option>
                <option value="price-asc">Rent: Low to High</option>
                <option value="price-desc">Rent: High to Low</option>
                <option value="rooms">Most Rooms</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fa-solid fa-grip me-1"></i> Grid
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
                onClick={() => setViewMode('map')}
              >
                <i className="fa-solid fa-map-location-dot me-1"></i> Map View
              </button>
            </div>
          </div>
        </div>

        {/* Loading State: Skeleton Shimmer Cards */}
        {loading ? (
          <div className="row g-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="col-md-6 col-lg-4">
                <div className="card border-0 p-3 h-100" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--card-bg)' }}>
                  <div className="skeleton-box mb-3" style={{ height: '200px' }}></div>
                  <div className="skeleton-box mb-2" style={{ height: '24px', width: '70%' }}></div>
                  <div className="skeleton-box mb-3" style={{ height: '16px', width: '40%' }}></div>
                  <div className="skeleton-box mb-3" style={{ height: '40px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'map' ? (
          <MapView properties={sortedProperties} />
        ) : sortedProperties.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <i className="fa-regular fa-folder-open fa-4x" style={{ color: 'var(--text-secondary)', opacity: 0.4, marginBottom: '1.5rem' }}></i>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>No Properties Found</h4>
            <p style={{ color: 'var(--text-secondary)' }}>Try broadening your search criteria or category filter.</p>
            <button onClick={handleResetFilters} className="btn btn-primary-custom" style={{ margin: '0 auto', padding: '0.8rem 2rem' }}>
              Browse All Properties
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {sortedProperties.map(property => (
              <div key={property.property_id} className="col-md-6 col-lg-4">
                <PropertyCard
                  property={property}
                  isFavorite={favorites[property.property_id]}
                  onToggleFavorite={handleToggleFavorite}
                  isCompared={compareList.some(p => p.property_id === property.property_id)}
                  onToggleCompare={handleToggleCompare}
                  user={user}
                  showToast={addToast}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side-by-Side Compare Drawer */}
      <CompareDrawer
        compareList={compareList}
        removeFromCompare={(id) => setCompareList(prev => prev.filter(p => p.property_id !== id))}
        clearCompare={() => setCompareList([])}
      />
    </div>
  );
};

export default Home;
