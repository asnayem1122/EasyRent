import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user, logout, updateProfileState } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'default';

  // State triggers
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', password: '' });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // General lists
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Add Property State
  const [propertyForm, setPropertyForm] = useState({
    title: '', description: '', rent: '', location: '', rooms: '', bathrooms: '', property_type: 'Flat', contact_info: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [addPropSuccess, setAddPropSuccess] = useState('');
  const [addPropError, setAddPropError] = useState('');
  const [addingProperty, setAddingProperty] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: ''
    });

    // Reset messages
    setProfileSuccess('');
    setProfileError('');
    setAddPropSuccess('');
    setAddPropError('');
  }, [user, activeTab]);

  // Load tab data dynamically
  useEffect(() => {
    if (!user) return;
    
    const loadTabData = async () => {
      setLoading(true);
      try {
        if (user.role === 'admin') {
          if (activeTab === 'stats' || activeTab === 'default') {
            const res = await axios.get('/admin/stats');
            setStats(res.data);
          } else if (activeTab === 'properties') {
            const res = await axios.get('/admin/properties');
            setProperties(res.data);
          } else if (activeTab === 'users') {
            const res = await axios.get('/admin/users');
            setUsers(res.data);
          }
        } else if (user.role === 'owner') {
          if (activeTab === 'listings' || activeTab === 'default') {
            const res = await axios.get('/properties/my-listings');
            setProperties(res.data);
          } else if (activeTab === 'inquiries') {
            const res = await axios.get('/inquiries');
            setInquiries(res.data);
          }
        } else if (user.role === 'tenant') {
          if (activeTab === 'favorites') {
            const res = await axios.get('/properties/favorites');
            setFavorites(res.data);
          } else if (activeTab === 'inquiries') {
            const res = await axios.get('/inquiries');
            setInquiries(res.data);
          }
        }
      } catch (err) {
        console.error('Error loading dashboard tab details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [user, activeTab]);

  // Profile Form Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setUpdatingProfile(true);

    try {
      const res = await axios.put('/auth/profile', profileData);
      updateProfileState(res.data.user);
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Add Property Form Handlers
  const handleAddPropInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleAddPropSubmit = async (e) => {
    e.preventDefault();
    setAddPropSuccess('');
    setAddPropError('');
    setAddingProperty(true);

    const formData = new FormData();
    Object.keys(propertyForm).forEach(key => {
      formData.append(key, propertyForm[key]);
    });

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    try {
      await axios.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAddPropSuccess('Property listing created successfully! It is pending administrator approval.');
      setPropertyForm({
        title: '', description: '', rent: '', location: '', rooms: '', bathrooms: '', property_type: 'Flat', contact_info: ''
      });
      setSelectedFiles([]);
      e.target.reset();
    } catch (err) {
      setAddPropError(err.response?.data?.error || 'Failed to submit property listing.');
    } finally {
      setAddingProperty(false);
    }
  };

  // Admin Listing Actions
  const handleApproveReject = async (propertyId, status) => {
    try {
      await axios.put(`/admin/properties/${propertyId}/approval`, { approval_status: status });
      // Refresh properties list
      const res = await axios.get('/admin/properties');
      setProperties(res.data);
    } catch (err) {
      console.error('Error updating approval status:', err);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property listing? This cannot be undone.')) return;
    try {
      await axios.delete(`/properties/${propertyId}`);
      if (user.role === 'admin') {
        setProperties(prev => prev.filter(p => p.property_id !== propertyId));
      } else {
        setProperties(prev => prev.filter(p => p.property_id !== propertyId));
      }
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  // Admin User Actions
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All listings, inquiries, and favorites belonging to them will also be deleted.')) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.user_id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Tenant Favorite Untoggle
  const handleRemoveFavorite = async (propertyId, e) => {
    e.preventDefault();
    try {
      await axios.post(`/properties/${propertyId}/favorite`);
      setFavorites(prev => prev.filter(f => f.property_id !== propertyId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      
      <main className="dashboard-content">
        {/* TAB 1: Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--radius-lg)', maxWidth: '700px' }}>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-user-gears text-primary me-2"></i> Account Profile</h2>
            
            {profileSuccess && <div className="alert alert-success py-2 mb-3"><i className="fa-solid fa-circle-check"></i> {profileSuccess}</div>}
            {profileError && <div className="alert alert-danger py-2 mb-3"><i className="fa-solid fa-triangle-exclamation"></i> {profileError}</div>}

            <form onSubmit={handleProfileSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label-custom">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-custom" 
                    name="name" 
                    value={profileData.name} 
                    onChange={handleProfileInputChange} 
                    required 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label-custom">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-control form-control-custom" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleProfileInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label-custom">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-custom" 
                  name="email" 
                  value={profileData.email} 
                  onChange={handleProfileInputChange} 
                  required 
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label-custom">Change Password (leave empty to keep current)</label>
                <input 
                  type="password" 
                  className="form-control form-control-custom" 
                  name="password" 
                  value={profileData.password} 
                  onChange={handleProfileInputChange} 
                  placeholder="••••••••" 
                />
              </div>

              <button type="submit" disabled={updatingProfile} className="btn btn-primary-custom px-4">
                {updatingProfile ? 'Updating...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== TENANT VIEWS ==================== */}
        
        {/* Tenant: Saved Favorites */}
        {user.role === 'tenant' && activeTab === 'favorites' && (
          <div>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-heart text-danger me-2"></i> Saved Favorites</h2>
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : favorites.length === 0 ? (
              <div className="card text-center border-0 shadow-sm py-5 rounded-4">
                <div className="card-body">
                  <i className="fa-regular fa-heart fa-3x text-muted opacity-50 mb-3"></i>
                  <h5 className="fw-bold text-secondary">No Saved Properties</h5>
                  <p className="text-muted">You haven't added any listings to your favorites yet.</p>
                  <Link to="/" className="btn btn-primary-custom mt-2">Find Properties</Link>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {favorites.map(property => {
                  const hasImage = property.main_image;
                  const imageSrc = hasImage ? `http://localhost:5000/${property.main_image}` : 'placeholder';

                  return (
                    <div key={property.property_id} className="col-md-6 col-lg-4">
                      <div className="property-card">
                        <div className="property-img-wrapper">
                          <span className="property-badge-type">{property.property_type}</span>
                          <span className="property-badge-rent">৳{Number(property.rent).toLocaleString()}</span>
                          
                          {hasImage ? (
                            <img src={imageSrc} className="property-img" alt={property.title} />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 text-muted bg-light">
                              <i className="fa-regular fa-image fa-3x"></i>
                            </div>
                          )}

                          <button onClick={(e) => handleRemoveFavorite(property.property_id, e)} className="favorite-btn active">
                            <i className="fa-solid fa-heart"></i>
                          </button>
                        </div>
                        
                        <div className="property-body">
                          <h4 className="property-title">
                            <Link to={`/property/${property.property_id}`}>{property.title}</Link>
                          </h4>
                          <div className="property-location"><i className="fa-solid fa-location-dot text-primary"></i> {property.location}</div>
                          <Link to={`/property/${property.property_id}`} className="btn btn-secondary-custom btn-sm w-100 mt-2">View Property</Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tenant: Sent Inquiries */}
        {user.role === 'tenant' && activeTab === 'inquiries' && (
          <div>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-envelope text-primary me-2"></i> Sent Inquiries</h2>
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : inquiries.length === 0 ? (
              <div className="card text-center border-0 shadow-sm py-5 rounded-4">
                <div className="card-body">
                  <i className="fa-regular fa-envelope-open fa-3x text-muted opacity-50 mb-3"></i>
                  <h5 className="fw-bold text-secondary">No Inquiries Found</h5>
                  <p className="text-muted">You haven't sent any inquiries for rental listings yet.</p>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Property Listing</th>
                        <th>Owner</th>
                        <th>Message Sent</th>
                        <th>Date Sent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq.inquiry_id}>
                          <td>
                            <Link to={`/property/${inq.property_id}`} className="fw-bold text-dark">{inq.property_title}</Link>
                          </td>
                          <td>{inq.owner_name}</td>
                          <td style={{ maxWidth: '300px' }} className="text-secondary small">{inq.message}</td>
                          <td>{new Date(inq.inquiry_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== OWNER VIEWS ==================== */}

        {/* Owner: My Listings */}
        {user.role === 'owner' && (activeTab === 'listings' || activeTab === 'default') && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h2 className="fw-bold mb-0"><i className="fa-solid fa-house text-primary me-2"></i> My Properties</h2>
              <Link to="/dashboard?tab=add-property" className="btn btn-primary-custom">
                <i className="fa-solid fa-plus"></i> Add New Listing
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : properties.length === 0 ? (
              <div className="card text-center border-0 shadow-sm py-5 rounded-4">
                <div className="card-body">
                  <i className="fa-solid fa-house-circle-xmark fa-3x text-muted opacity-50 mb-3"></i>
                  <h5 className="fw-bold text-secondary">No Properties Listed</h5>
                  <p className="text-muted">You haven't created any property listings yet.</p>
                  <Link to="/dashboard?tab=add-property" className="btn btn-primary-custom mt-2">List Your First Property</Link>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Listing Details</th>
                        <th>Monthly Rent</th>
                        <th>Type</th>
                        <th>Availability</th>
                        <th>Admin Approval</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map(p => (
                        <tr key={p.property_id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              {p.main_image ? (
                                <img src={`http://localhost:5000/${p.main_image}`} alt={p.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              ) : (
                                <div className="bg-light text-muted d-flex align-items-center justify-content-center" style={{ width: '60px', height: '40px', borderRadius: '4px' }}>
                                  <i className="fa-regular fa-image"></i>
                                </div>
                              )}
                              <div>
                                <Link to={`/property/${p.property_id}`} className="fw-bold text-dark d-block">{p.title}</Link>
                                <span className="text-muted small"><i className="fa-solid fa-location-dot"></i> {p.location}</span>
                              </div>
                            </div>
                          </td>
                          <td className="fw-bold">৳{Number(p.rent).toLocaleString()}</td>
                          <td>{p.property_type}</td>
                          <td>
                            <span className={`badge ${p.status === 'Available' ? 'bg-success' : 'bg-secondary'}`}>{p.status}</span>
                          </td>
                          <td>
                            <span className={`badge ${p.approval_status === 'Approved' ? 'bg-success' : p.approval_status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                              {p.approval_status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <Link to={`/edit-property/${p.property_id}`} className="btn btn-sm btn-outline-primary"><i className="fa-solid fa-pen-to-square"></i> Edit</Link>
                              <button onClick={() => handleDeleteProperty(p.property_id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash"></i> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Owner: Add Property */}
        {user.role === 'owner' && activeTab === 'add-property' && (
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--radius-lg)', maxWidth: '850px' }}>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-circle-plus text-primary me-2"></i> List a New Property</h2>
            
            {addPropSuccess && <div className="alert alert-success py-2 mb-3"><i className="fa-solid fa-circle-check"></i> {addPropSuccess}</div>}
            {addPropError && <div className="alert alert-danger py-2 mb-3"><i className="fa-solid fa-triangle-exclamation"></i> {addPropError}</div>}

            <form onSubmit={handleAddPropSubmit}>
              <div className="mb-3">
                <label className="form-label-custom">Property Title</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  name="title" 
                  value={propertyForm.title} 
                  onChange={handleAddPropInputChange} 
                  required 
                  placeholder="e.g., Spacious 3 BHK Flat in Downtown"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label-custom">Property Type</label>
                  <select 
                    className="form-select form-control-custom" 
                    name="property_type" 
                    value={propertyForm.property_type} 
                    onChange={handleAddPropInputChange} 
                    required
                  >
                    <option value="Flat">Flat</option>
                    <option value="House">House</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label-custom">Monthly Rent (৳)</label>
                  <input 
                    type="number" 
                    className="form-control form-control-custom" 
                    name="rent" 
                    value={propertyForm.rent} 
                    onChange={handleAddPropInputChange} 
                    required 
                    placeholder="e.g., 1200" 
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Location</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  name="location" 
                  value={propertyForm.location} 
                  onChange={handleAddPropInputChange} 
                  required 
                  placeholder="e.g., 123 Main St, Downtown"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label-custom">Number of Rooms</label>
                  <input 
                    type="number" 
                    className="form-control form-control-custom" 
                    name="rooms" 
                    value={propertyForm.rooms} 
                    onChange={handleAddPropInputChange} 
                    required 
                    placeholder="e.g., 3" 
                    min="1"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label-custom">Number of Bathrooms</label>
                  <input 
                    type="number" 
                    className="form-control form-control-custom" 
                    name="bathrooms" 
                    value={propertyForm.bathrooms} 
                    onChange={handleAddPropInputChange} 
                    required 
                    placeholder="e.g., 2" 
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Description</label>
                <textarea 
                  className="form-control form-control-custom" 
                  name="description" 
                  value={propertyForm.description} 
                  onChange={handleAddPropInputChange} 
                  required 
                  rows="4" 
                  placeholder="Describe your property (amenities, context, conditions, transit)..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Owner Contact Details / Instructions</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  name="contact_info" 
                  value={propertyForm.contact_info} 
                  onChange={handleAddPropInputChange} 
                  required 
                  placeholder="e.g., Call John: +1234567890 or email john@example.com"
                />
              </div>

              <div className="mb-4">
                <label className="form-label-custom">Upload Property Images (Limit: 5 images, Max 5MB each)</label>
                <input 
                  type="file" 
                  className="form-control form-control-custom" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange} 
                />
                <small className="text-muted mt-1 d-block">Supported file types: jpg, jpeg, png, webp</small>
              </div>

              <button type="submit" disabled={addingProperty} className="btn btn-primary-custom w-100 py-2.5">
                {addingProperty ? 'Listing Property...' : 'Submit Property for Admin Review'}
              </button>
            </form>
          </div>
        )}

        {/* Owner: Received Inquiries */}
        {user.role === 'owner' && activeTab === 'inquiries' && (
          <div>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-envelope text-primary me-2"></i> Tenant Inquiries</h2>
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : inquiries.length === 0 ? (
              <div className="card text-center border-0 shadow-sm py-5 rounded-4">
                <div className="card-body">
                  <i className="fa-regular fa-envelope-open fa-3x text-muted opacity-50 mb-3"></i>
                  <h5 className="fw-bold text-secondary">No Inquiries Received</h5>
                  <p className="text-muted">No tenants have sent inquiries for your properties yet.</p>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Property Listing</th>
                        <th>Tenant Contact</th>
                        <th>Message</th>
                        <th>Date Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq.inquiry_id}>
                          <td>
                            <Link to={`/property/${inq.property_id}`} className="fw-bold text-dark">{inq.property_title}</Link>
                          </td>
                          <td>
                            <strong>{inq.tenant_name}</strong>
                            <div className="text-muted small">📞 {inq.tenant_phone}</div>
                            <div className="text-muted small">✉ {inq.tenant_email}</div>
                          </td>
                          <td style={{ maxWidth: '350px' }} className="text-secondary small">{inq.message}</td>
                          <td>{new Date(inq.inquiry_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== ADMIN VIEWS ==================== */}

        {/* Admin: System Stats */}
        {user.role === 'admin' && (activeTab === 'stats' || activeTab === 'default') && stats && (
          <div>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-chart-pie text-primary me-2"></i> System Statistics</h2>
            
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                  <div className="stat-value">{stats.users.total}</div>
                  <div className="stat-label">Total Registered Users ({stats.users.owners} Owners, {stats.users.tenants} Tenants)</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary-color)' }}><i className="fa-solid fa-house"></i></div>
                  <div className="stat-value">{stats.properties.total}</div>
                  <div className="stat-label">Properties ({stats.properties.active} Active, {stats.properties.pending} Pending Review)</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-color)' }}><i className="fa-solid fa-envelope"></i></div>
                  <div className="stat-value">{stats.inquiries.total}</div>
                  <div className="stat-label">Total Inquiries Submitted</div>
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <h5 className="fw-bold mb-2">Welcome to the Easy Rent Administration Portal</h5>
              <p className="text-secondary mb-0 small">Use the sidebar links to approve incoming property listing submissions, edit active listings, and manage system user accounts.</p>
            </div>
          </div>
        )}

        {/* Admin: Review Listings */}
        {user.role === 'admin' && activeTab === 'properties' && (
          <div>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-list-check text-primary me-2"></i> Review Property Submissions</h2>
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : properties.length === 0 ? (
              <div className="card text-center border-0 shadow-sm py-5 rounded-4">
                <div className="card-body">
                  <i className="fa-solid fa-folder-open fa-3x text-muted opacity-50 mb-3"></i>
                  <h5 className="fw-bold text-secondary">No Properties in Database</h5>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Property Title</th>
                        <th>Owner</th>
                        <th>Price/mo</th>
                        <th>Availability</th>
                        <th>Approval</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map(p => (
                        <tr key={p.property_id}>
                          <td>
                            <Link to={`/property/${p.property_id}`} className="fw-bold text-dark">{p.title}</Link>
                            <div className="text-muted small"><i className="fa-solid fa-location-dot"></i> {p.location}</div>
                          </td>
                          <td>
                            <strong>{p.owner_name}</strong>
                            <div className="text-muted small">{p.owner_email}</div>
                          </td>
                          <td className="fw-bold">৳{Number(p.rent).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${p.status === 'Available' ? 'bg-success' : 'bg-secondary'}`}>{p.status}</span>
                          </td>
                          <td>
                            <span className={`badge ${p.approval_status === 'Approved' ? 'bg-success' : p.approval_status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                              {p.approval_status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1.5 flex-wrap">
                              {p.approval_status !== 'Approved' && (
                                <button onClick={() => handleApproveReject(p.property_id, 'Approved')} className="btn btn-sm btn-success py-1 px-2 small"><i className="fa-solid fa-circle-check"></i> Approve</button>
                              )}
                              {p.approval_status !== 'Rejected' && (
                                <button onClick={() => handleApproveReject(p.property_id, 'Rejected')} className="btn btn-sm btn-warning py-1 px-2 small"><i className="fa-solid fa-circle-xmark"></i> Reject</button>
                              )}
                              <button onClick={() => handleDeleteProperty(p.property_id)} className="btn btn-sm btn-outline-danger py-1 px-2 small"><i className="fa-solid fa-trash"></i> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin: Manage Users */}
        {user.role === 'admin' && activeTab === 'users' && (
          <div>
            <h2 className="fw-bold mb-4"><i className="fa-solid fa-users text-primary me-2"></i> Manage User Accounts</h2>
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : users.length === 0 ? (
              <div className="card text-center border-0 shadow-sm py-5 rounded-4">
                <div className="card-body">
                  <i className="fa-solid fa-users-slash fa-3x text-muted opacity-50 mb-3"></i>
                  <h5 className="fw-bold text-secondary">No Other Users Found</h5>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>Phone</th>
                        <th>User Role</th>
                        <th>Registered Date</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.user_id}>
                          <td className="fw-bold text-dark">{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'owner' ? 'bg-primary' : 'bg-success'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="text-end">
                            <button onClick={() => handleDeleteUser(u.user_id)} className="btn btn-sm btn-danger py-1 px-2 small">
                              <i className="fa-solid fa-user-slash"></i> Delete Account
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
