import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../config';

const PropertyCard = ({ property, isFavorite, onToggleFavorite, isCompared, onToggleCompare, user, showToast }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Extract all available images
  const images = property.images && property.images.length > 0
    ? property.images.map(img => img.image_path.startsWith('http') ? img.image_path : `${IMAGE_BASE_URL}${img.image_path}`)
    : property.main_image
      ? [property.main_image.startsWith('http') ? property.main_image : `${IMAGE_BASE_URL}${property.main_image}`]
      : [];

  const activeSrc = images.length > 0 ? images[currentImgIndex] : null;

  const handleNextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="property-card h-100 d-flex flex-column">
      <div className="property-img-wrapper position-relative">
        <span className="property-badge-type">{property.property_type}</span>
        
        <span className={`property-badge-status ${property.status === 'Available' ? 'bg-success' : 'bg-secondary'}`}>
          {property.status}
        </span>

        <span className="property-badge-rent">৳{Number(property.rent).toLocaleString()}/mo</span>

        {/* Carousel buttons if multiple images */}
        {images.length > 1 && (
          <>
            <button className="carousel-btn prev" onClick={handlePrevImg} title="Previous photo">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="carousel-btn next" onClick={handleNextImg} title="Next photo">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </>
        )}

        {activeSrc ? (
          <img src={activeSrc} className="property-img" alt={property.title} />
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
            onClick={(e) => onToggleFavorite(property.property_id, e)}
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          >
            <i className={`fa-heart ${isFavorite ? 'fa-solid' : 'fa-regular'}`}></i>
          </button>
        )}
      </div>

      <div className="property-body d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 700 }}>
            <i className="fa-solid fa-circle-check me-1"></i>Verified Owner
          </span>
          {onToggleCompare && (
            <label className="d-flex align-items-center gap-1 style-pointer small text-muted" style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
              <input
                type="checkbox"
                checked={isCompared || false}
                onChange={() => onToggleCompare(property)}
                style={{ cursor: 'pointer' }}
              />
              Compare
            </label>
          )}
        </div>

        <h3 className="property-title">
          <Link to={`/property/${property.property_id}`}>{property.title}</Link>
        </h3>

        <div className="property-location">
          <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-color)' }}></i>{' '}
          {property.location}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: 1.6, flexGrow: 1 }}>
          {property.description.length > 85
            ? `${property.description.substring(0, 85)}...`
            : property.description}
        </p>

        <div className="property-amenities mt-auto">
          <span><i className="fa-solid fa-bed me-1" style={{ color: 'var(--primary-color)' }}></i>{property.rooms} Rooms</span>
          <span><i className="fa-solid fa-bath me-1" style={{ color: 'var(--primary-color)' }}></i>{property.bathrooms} Bathrooms</span>
        </div>

        <Link to={`/property/${property.property_id}`} className="btn btn-secondary-custom w-100 mt-3" style={{ padding: '0.7rem' }}>
          <i className="fa-solid fa-circle-info me-1"></i>View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
