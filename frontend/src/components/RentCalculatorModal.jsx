import React, { useState } from 'react';

const RentCalculatorModal = ({ rentAmount, show, onClose }) => {
  const [monthsAdvance, setMonthsAdvance] = useState(2);
  const [utilityEst, setUtilityEst] = useState(3500);

  if (!show) return null;

  const monthlyRent = Number(rentAmount) || 0;
  const securityAdvance = monthlyRent * monthsAdvance;
  const totalFirstMonth = monthlyRent + securityAdvance + Number(utilityEst);

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', backdropFilter: 'blur(30px)' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <i className="fa-solid fa-calculator text-primary me-2"></i>Rent & Budget Estimator
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label-custom">Monthly Base Rent</label>
              <input type="text" className="form-control form-control-custom" value={`৳${monthlyRent.toLocaleString()}`} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Security Deposit / Advance ({monthsAdvance} Months)</label>
              <input
                type="range"
                className="form-range"
                min="1"
                max="6"
                value={monthsAdvance}
                onChange={(e) => setMonthsAdvance(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>1 Month</span>
                <strong className="text-primary">৳{securityAdvance.toLocaleString()}</strong>
                <span>6 Months</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Estimated Monthly Utilities (Electricity, Gas, Service)</label>
              <input
                type="number"
                className="form-control form-control-custom"
                value={utilityEst}
                onChange={(e) => setUtilityEst(e.target.value)}
              />
            </div>

            <hr />

            <div className="p-3 bg-light rounded-3 text-center">
              <div className="small text-muted mb-1">Estimated Initial Move-In Budget (First Month + Deposit)</div>
              <div className="h3 fw-bold text-primary mb-0">৳{totalFirstMonth.toLocaleString()}</div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-primary-custom w-100" onClick={onClose}>Close Estimator</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCalculatorModal;
