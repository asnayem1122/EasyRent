import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MapView = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Simulated coordinate offsets for Bangladeshi map visual
  const pins = properties.map((prop, idx) => ({
    ...prop,
    top: 25 + (idx * 14) % 55 + '%',
    left: 20 + (idx * 18) % 65 + '%'
  }));

  return (
    <div className="map-placeholder-container">
      {/* Map visual background overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15,
        backgroundImage: 'radial-gradient(circle at 50% 50%, var(--primary-color) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      <div className="position-absolute top-0 start-0 m-3 z-3">
        <span className="badge bg-dark bg-opacity-75 p-2 px-3 rounded-pill border border-secondary text-white">
          <i className="fa-solid fa-map-location-dot me-2 text-primary"></i>Interactive Map View ({properties.length} Listings)
        </span>
      </div>

      {pins.map((pin) => (
        <div
          key={pin.property_id}
          className="map-pin"
          style={{ top: pin.top, left: pin.left }}
          onClick={() => setSelectedProperty(pin)}
        >
          <div className="map-pin-badge">
            <i className="fa-solid fa-house me-1"></i>৳{Number(pin.rent).toLocaleString()}
          </div>
        </div>
      ))}

      {/* Selected Property Popup */}
      {selectedProperty && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-4 p-3 rounded-4 shadow-lg border text-start"
          style={{
            width: '90%', maxWidth: '380px', background: 'var(--glass-bg)',
            backdropFilter: 'blur(30px)', borderColor: 'var(--glass-border)', zIndex: 20
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary">{selectedProperty.property_type}</span>
            <button type="button" className="btn-close" onClick={() => setSelectedProperty(null)}></button>
          </div>
          <h6 className="fw-bold mb-1">{selectedProperty.title}</h6>
          <div className="small text-muted mb-2"><i className="fa-solid fa-location-dot me-1"></i>{selectedProperty.location}</div>
          <div className="fw-bold text-primary mb-2">৳{Number(selectedProperty.rent).toLocaleString()}/mo</div>
          <Link to={`/property/${selectedProperty.property_id}`} className="btn btn-sm btn-primary-custom w-100">
            View Listing
          </Link>
        </div>
      )}
    </div>
  );
};

export default MapView;
