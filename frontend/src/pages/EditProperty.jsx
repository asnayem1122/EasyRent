import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL } from '../config';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    rent: '',
    location: '',
    rooms: '',
    bathrooms: '',
    property_type: 'Flat',
    status: 'Available',
    contact_info: ''
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPropertyDetails = async () => {
      try {
        const res = await axios.get(`/properties/${id}`);
        const prop = res.data;

        // Verify ownership
        if (parseInt(prop.owner_id) !== parseInt(user.user_id) && user.role !== 'admin') {
          navigate('/dashboard');
          return;
        }

        setPropertyForm({
          title: prop.title || '',
          description: prop.description || '',
          rent: prop.rent || '',
          location: prop.location || '',
          rooms: prop.rooms || '',
          bathrooms: prop.bathrooms || '',
          property_type: prop.property_type || 'Flat',
          status: prop.status || 'Available',
          contact_info: prop.contact_info || ''
        });

        setExistingImages(prop.images || []);
      } catch (err) {
        setError('Failed to fetch property details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewFiles(e.target.files);
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await axios.delete(`/properties/image/${imageId}`);
      setExistingImages(prev => prev.filter(img => img.image_id !== imageId));
      setSuccess('Image deleted successfully.');
    } catch (err) {
      setError('Failed to delete image.');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const formData = new FormData();
    Object.keys(propertyForm).forEach(key => {
      formData.append(key, propertyForm[key]);
    });

    for (let i = 0; i < newFiles.length; i++) {
      formData.append('images', newFiles[i]);
    }

    try {
      await axios.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Property details updated successfully!');
      // Refresh details
      const refresh = await axios.get(`/properties/${id}`);
      setExistingImages(refresh.data.images || []);
      setNewFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update property details.');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="container my-5 flex-grow-1" style={{ maxWidth: '850px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0"><i className="fa-solid fa-pen-to-square text-primary me-2"></i> Edit Property Listing</h2>
        <Link to="/dashboard" className="btn btn-secondary-custom btn-sm"><i className="fa-solid fa-arrow-left"></i> Back to Dashboard</Link>
      </div>

      {success && <div className="alert alert-success py-2 mb-3"><i className="fa-solid fa-circle-check"></i> {success}</div>}
      {error && <div className="alert alert-danger py-2 mb-3"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>}

      <div className="row g-4">
        {/* Edit Form */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 'var(--radius-lg)' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label-custom">Property Title</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  name="title" 
                  value={propertyForm.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label-custom">Property Type</label>
                  <select 
                    className="form-select form-control-custom" 
                    name="property_type" 
                    value={propertyForm.property_type} 
                    onChange={handleInputChange} 
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
                    onChange={handleInputChange} 
                    required 
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
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label-custom">Number of Rooms</label>
                  <input 
                    type="number" 
                    className="form-control form-control-custom" 
                    name="rooms" 
                    value={propertyForm.rooms} 
                    onChange={handleInputChange} 
                    required 
                    min="1"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label-custom">Number of Bathrooms</label>
                  <input 
                    type="number" 
                    className="form-control form-control-custom" 
                    name="bathrooms" 
                    value={propertyForm.bathrooms} 
                    onChange={handleInputChange} 
                    required 
                    min="1"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label-custom">Availability Status</label>
                  <select 
                    className="form-select form-control-custom" 
                    name="status" 
                    value={propertyForm.status} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Description</label>
                <textarea 
                  className="form-control form-control-custom" 
                  name="description" 
                  value={propertyForm.description} 
                  onChange={handleInputChange} 
                  required 
                  rows="4" 
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Owner Contact Details / Instructions</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  name="contact_info" 
                  value={propertyForm.contact_info} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label-custom">Upload Additional Images</label>
                <input 
                  type="file" 
                  className="form-control form-control-custom" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange} 
                  ref={fileInputRef}
                />
                <small className="text-muted mt-1 d-block">Supported file types: jpg, jpeg, png, webp</small>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary-custom w-100 py-2.5">
                {submitting ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Images Sidebar */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 'var(--radius-lg)' }}>
            <h4 className="fw-bold mb-3 small text-uppercase text-secondary">Active Images</h4>
            
            {existingImages.length === 0 ? (
              <p className="text-muted small mb-0">No images uploaded for this listing.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {existingImages.map((img) => (
                  <div key={img.image_id} className="position-relative border rounded overflow-hidden" style={{ height: '120px' }}>
                    <img src={`${IMAGE_BASE_URL}${img.image_path}`} alt="Listing item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      onClick={() => handleDeleteImage(img.image_id)} 
                      className="btn btn-sm btn-danger position-absolute"
                      style={{ top: '8px', right: '8px', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                      type="button"
                      title="Delete Image"
                    >
                      <i className="fa-solid fa-trash-can small"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
