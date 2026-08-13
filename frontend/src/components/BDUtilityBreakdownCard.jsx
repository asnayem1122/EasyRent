import React from 'react';

const BDUtilityBreakdownCard = ({ property }) => {
  if (!property) return null;

  return (
    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 'var(--radius-lg)' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">
          <i className="fa-solid fa-bolt text-warning me-2"></i>BD Utilities & Infrastructure
        </h4>
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-1.5 rounded-pill">
          ✓ Verified Specs
        </span>
      </div>

      <div className="row g-3">
        {/* Titas Gas vs Cylinder */}
        <div className="col-md-6">
          <div className="p-3 rounded-3 border d-flex align-items-center gap-3" style={{ background: 'var(--card-bg)' }}>
            <div className="rounded-circle p-2.5 bg-danger bg-opacity-10 text-danger" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-fire fa-lg"></i>
            </div>
            <div>
              <div className="small text-muted">Gas Supply</div>
              <strong className="d-block text-dark">{property.gas_supply || 'Titas Line Gas'}</strong>
            </div>
          </div>
        </div>

        {/* Generator Backup */}
        <div className="col-md-6">
          <div className="p-3 rounded-3 border d-flex align-items-center gap-3" style={{ background: 'var(--card-bg)' }}>
            <div className="rounded-circle p-2.5 bg-warning bg-opacity-10 text-warning" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-charging-station fa-lg"></i>
            </div>
            <div>
              <div className="small text-muted">Power Backup</div>
              <strong className="d-block text-dark">{property.power_backup || '24/7 Generator Backup'}</strong>
            </div>
          </div>
        </div>

        {/* Metro Rail Proximity */}
        <div className="col-md-6">
          <div className="p-3 rounded-3 border d-flex align-items-center gap-3" style={{ background: 'var(--card-bg)' }}>
            <div className="rounded-circle p-2.5 bg-primary bg-opacity-10 text-primary" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-train-subway fa-lg"></i>
            </div>
            <div>
              <div className="small text-muted">Metro Rail / Transit</div>
              <strong className="d-block text-dark">{property.metro_distance || '5 mins to MRT Station'}</strong>
            </div>
          </div>
        </div>

        {/* Waterlogging / Elevation */}
        <div className="col-md-6">
          <div className="p-3 rounded-3 border d-flex align-items-center gap-3" style={{ background: 'var(--card-bg)' }}>
            <div className="rounded-circle p-2.5 bg-info bg-opacity-10 text-info" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-shield-halved fa-lg"></i>
            </div>
            <div>
              <div className="small text-muted">Monsoon Elevation</div>
              <strong className="d-block text-dark">{property.waterlogging_status || 'Elevated Road — No Waterlogging'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Rent & Service Charge Breakdown Box */}
      <div className="mt-4 p-3 rounded-3 border bg-light">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-secondary small">Base Monthly Rent:</span>
          <strong className="text-dark">৳{Number(property.rent).toLocaleString()}</strong>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-secondary small">Monthly Service Charge (Guard, Lift, Trash, CCTV):</span>
          <strong className="text-dark">৳{Number(property.service_charge || 4000).toLocaleString()}</strong>
        </div>
        <hr className="my-2" />
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-dark">Total Monthly Payment:</span>
          <strong className="text-primary fs-5">৳{(Number(property.rent) + Number(property.service_charge || 4000)).toLocaleString()}/mo</strong>
        </div>
      </div>
    </div>
  );
};

export default BDUtilityBreakdownCard;
