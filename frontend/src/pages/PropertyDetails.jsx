import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL } from '../config';

import { MOCK_PROPERTIES } from '../mockData';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [isFav, setIsFav] = useState(false);
  
  // Inquiry form state
  const [inquiryMessage, setInquiryMessage] = useState('Hello! I am very interested in this property. Is it available for viewing? Please let me know the best time to connect. Thank you!');
  const [inquirySuccess, setInquirySuccess] = useState('');
  const [inquiryError, setInquiryError] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/properties/${id}`);
      setProperty(res.data);
      if (res.data.images && res.data.images.length > 0) {
        const firstImg = res.data.images[0].image_path;
        setActiveImage(firstImg.startsWith('http') ? firstImg : `${IMAGE_BASE_URL}${firstImg}`);
      } else if (res.data.main_image) {
        setActiveImage(res.data.main_image.startsWith('http') ? res.data.main_image : `${IMAGE_BASE_URL}${res.data.main_image}`);
      } else {
        setActiveImage('placeholder');
      }
    } catch (err) {
      console.warn('Backend API unavailable. Fetching demo property details:', err);
      const mock = MOCK_PROPERTIES.find(p => String(p.property_id) === String(id)) || MOCK_PROPERTIES[0];
      setProperty(mock);
      if (mock && mock.images && mock.images.length > 0) {
        const firstImg = mock.images[0].image_path;
        setActiveImage(firstImg.startsWith('http') ? firstImg : `${IMAGE_BASE_URL}${firstImg}`);
      } else if (mock && mock.main_image) {
        setActiveImage(mock.main_image.startsWith('http') ? mock.main_image : `${IMAGE_BASE_URL}${mock.main_image}`);
      } else {
        setActiveImage('placeholder');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (user && user.role === 'tenant') {
      try {
        const res = await axios.get(`/properties/${id}/is-favorite`);
        setIsFav(res.data.isFavorite);
      } catch (err) {
        console.error('Error checking favorite status:', err);
      }
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'tenant') return;

    try {
      const res = await axios.post(`/properties/${id}/favorite`);
      setIsFav(res.data.favorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setInquirySuccess('');
    setInquiryError('');
    setSubmittingInquiry(true);

    try {
      await axios.post('/inquiries', {
        property_id: id,
        message: inquiryMessage
      });
      setInquirySuccess('Your inquiry has been successfully sent to the property owner!');
    } catch (err) {
      setInquiryError(err.response?.data?.error || 'Failed to submit inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center flex-grow-1">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container my-5 flex-grow-1 text-center">
        <div className="alert alert-danger">Property not found.</div>
        <Link to="/" className="btn btn-primary-custom mt-3">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container my-5 flex-grow-1">
      <div className="row g-4">
        {/* Left Column: Image Gallery & Details */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
            
            {/* Gallery Main */}
            <div className="gallery-main position-relative">
              {activeImage === 'placeholder' ? (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted bg-light" style={{ borderRadius: 'var(--radius-lg)' }}>
                  <i className="fa-regular fa-image fa-5x"></i>
                </div>
              ) : (
                <img 
                  src={activeImage} 
                  alt={property.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} 
                />
              )}

              <span className="property-badge-type" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>{property.property_type}</span>
              <span className="property-badge-rent" style={{ fontSize: '1.2rem', padding: '8px 20px' }}>৳{Number(property.rent).toLocaleString()}/mo</span>
            </div>

            {/* Gallery Thumbnails */}
            {property.images && property.images.length > 0 && (
              <div className="gallery-thumbs">
                {property.images.map((img, index) => {
                  const url = img.image_path.startsWith('http') ? img.image_path : `${IMAGE_BASE_URL}${img.image_path}`;
                  return (
                    <div 
                      key={img.image_id} 
                      onClick={() => setActiveImage(url)}
                      className={`gallery-thumb ${activeImage === url ? 'active' : ''}`}
                    >
                      <img src={url} alt={`Property thumbnail ${index + 1}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Property Descriptions */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
              <h1 className="fw-bold h2 mb-0">{property.title}</h1>
              {(!user || user.role === 'tenant') && (
                <button 
                  onClick={handleToggleFavorite} 
                  className={`btn ${isFav ? 'btn-danger' : 'btn-outline-secondary'} d-inline-flex align-items-center gap-2`}
                  style={{ borderRadius: 'var(--radius-md)', padding: '0.5rem 1.2rem', fontWeight: 600 }}
                >
                  <i className={`fa-heart ${isFav ? 'fa-solid' : 'fa-regular'}`}></i>
                  {isFav ? 'Saved to Favorites' : 'Save Property'}
                </button>
              )}
            </div>

            <div className="text-muted mb-4 d-flex align-items-center gap-2">
              <i className="fa-solid fa-location-dot text-primary"></i> 
              <span className="fs-5">{property.location}</span>
            </div>

            {/* Amenities Grid */}
            <div className="row g-3 p-3 bg-light rounded-4 mb-4 text-center">
              <div className="col-4">
                <i className="fa-solid fa-bed fa-2x text-primary mb-2"></i>
                <div className="fw-bold">{property.rooms} Rooms</div>
              </div>
              <div className="col-4">
                <i className="fa-solid fa-bath fa-2x text-primary mb-2"></i>
                <div className="fw-bold">{property.bathrooms} Bathrooms</div>
              </div>
              <div className="col-4">
                <i className="fa-solid fa-hotel fa-2x text-primary mb-2"></i>
                <div className="fw-bold">{property.property_type}</div>
              </div>
            </div>

            <h4 className="fw-bold mb-3">Property Description</h4>
            <p className="text-secondary" style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {property.description}
            </p>
          </div>
        </div>

        {/* Right Column: Contact & Inquiries */}
        <div className="col-lg-4">
          
          {/* Owner details card */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h4 className="fw-bold mb-3"><i className="fa-solid fa-user-tie text-primary me-2"></i> Listed by</h4>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '1.25rem', fontWeight: 'bold' }}>
                {property.owner_name ? property.owner_name.charAt(0).toUpperCase() : 'O'}
              </div>
              <div>
                <h5 className="fw-bold mb-0">{property.owner_name}</h5>
                <span className="text-muted small">Registered Owner</span>
              </div>
            </div>
            
            <hr />

            <div className="mb-3">
              <span className="text-muted small d-block">📞 Phone number</span>
              <strong className="text-dark">{property.owner_phone}</strong>
            </div>

            <div className="mb-3">
              <span className="text-muted small d-block">✉ Email Address</span>
              <strong className="text-dark">{property.owner_email}</strong>
            </div>

            <div className="mb-0 bg-light p-3 rounded-3">
              <span className="text-muted small d-block">💬 Owner Contact Instructions</span>
              <p className="mb-0 text-dark small mt-1"><em>{property.contact_info}</em></p>
            </div>
          </div>

          {/* Inquiry form card */}
          {(!user || user.role === 'tenant') && (
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--radius-lg)' }}>
              <h4 className="fw-bold mb-3"><i className="fa-solid fa-paper-plane text-primary me-2"></i> Send Inquiry</h4>
              
              {inquirySuccess && (
                <div className="alert alert-success py-2 mb-3 small">
                  <i className="fa-solid fa-circle-check me-2"></i> {inquirySuccess}
                </div>
              )}

              {inquiryError && (
                <div className="alert alert-danger py-2 mb-3 small">
                  <i className="fa-solid fa-triangle-exclamation me-2"></i> {inquiryError}
                </div>
              )}

              {user ? (
                <form onSubmit={handleInquirySubmit}>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label-custom">Message</label>
                    <textarea 
                      className="form-control form-control-custom" 
                      id="message" 
                      rows="4"
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      required
                      placeholder="Type your message to the owner..."
                      style={{ fontSize: '0.9rem' }}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submittingInquiry} 
                    className="btn btn-primary-custom w-100 py-2.5"
                  >
                    {submittingInquiry ? 'Sending...' : (
                      <>
                        <i className="fa-solid fa-paper-plane me-1"></i> Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted small mb-3">You must be logged in as a tenant to submit inquiries.</p>
                  <Link to="/login" className="btn btn-primary-custom btn-sm w-100">
                    Log In to Inquire
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Status badge for owner or admin */}
          {user && (user.role === 'owner' || user.role === 'admin') && (
            <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
              <h5 className="fw-bold mb-2">Listing Status</h5>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <span className={`badge ${property.approval_status === 'Approved' ? 'bg-success' : property.approval_status === 'Rejected' ? 'bg-danger' : 'bg-warning'} fs-6`}>
                  Approval: {property.approval_status}
                </span>
                <span className={`badge ${property.status === 'Available' ? 'bg-primary' : 'bg-secondary'} fs-6`}>
                  Status: {property.status}
                </span>
              </div>
              <p className="text-muted small mb-0">Admin approval is required for properties to appear publicly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
