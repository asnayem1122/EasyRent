import React from 'react';
import { Link } from 'react-router-dom';

const CompareDrawer = ({ compareList, removeFromCompare, clearCompare }) => {
  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="compare-drawer">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-code-compare text-primary fs-5"></i>
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
              Compare Properties ({compareList.length}/3)
            </h5>
          </div>
          <button onClick={clearCompare} className="btn btn-sm btn-outline-secondary">
            Clear All
          </button>
        </div>

        <div className="row g-3">
          {compareList.map(item => (
            <div key={item.property_id} className="col-md-4">
              <div className="p-3 border rounded-3 position-relative" style={{ background: 'var(--card-bg)' }}>
                <button
                  onClick={() => removeFromCompare(item.property_id)}
                  className="btn-close position-absolute"
                  style={{ top: '8px', right: '8px', fontSize: '0.75rem' }}
                ></button>
                <h6 className="fw-bold text-truncate mb-1" style={{ paddingRight: '20px' }}>{item.title}</h6>
                <div className="small text-primary fw-bold mb-2">৳{Number(item.rent).toLocaleString()}/mo</div>
                <div className="small text-muted mb-1"><i className="fa-solid fa-location-dot me-1"></i>{item.location}</div>
                <div className="small text-secondary">{item.rooms} Rooms • {item.bathrooms} Baths • {item.property_type}</div>
                <Link to={`/property/${item.property_id}`} className="btn btn-sm btn-primary-custom w-100 mt-2">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareDrawer;
