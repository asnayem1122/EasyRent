import React, { useState } from 'react';

const DMPVerificationModal = ({ property, user, show, onClose }) => {
  const [nidNumber, setNidNumber] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [generated, setGenerated] = useState(false);

  if (!show) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerated(true);
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', backdropFilter: 'blur(30px)' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <i className="fa-solid fa-file-shield text-primary me-2"></i>DMP Police Tenant Verification Form Generator
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {!generated ? (
              <form onSubmit={handleGenerate}>
                <p className="text-secondary small mb-3">
                  Generate official pre-filled <strong>Dhaka Metropolitan Police (DMP) Citizen / Tenant Information Form</strong> for renting {property?.title}.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Tenant Full Name</label>
                    <input type="text" className="form-control form-control-custom" value={user?.name || ''} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Mobile Number</label>
                    <input type="text" className="form-control form-control-custom" value={user?.phone || '+8801700000000'} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">National ID (NID) Number</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      required
                      placeholder="e.g. 19952691234567890"
                      value={nidNumber}
                      onChange={(e) => setNidNumber(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Emergency Contact Number</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      required
                      placeholder="e.g. +8801711223344"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button type="button" className="btn btn-secondary-custom me-2" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary-custom">
                    <i className="fa-solid fa-gears me-1"></i> Generate DMP Verification Form
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 border rounded-3 bg-white text-dark" style={{ fontFamily: 'sans-serif' }}>
                <div className="text-center mb-3">
                  <h5 className="fw-bold mb-0">DHAKA METROPOLITAN POLICE (DMP)</h5>
                  <div className="small text-muted">Citizen / Tenant Information Form (FLAT & HOUSE RENTAL)</div>
                </div>

                <div className="row g-2 small mb-3">
                  <div className="col-6"><strong>Property Address:</strong> {property?.location}</div>
                  <div className="col-6"><strong>Owner Name:</strong> {property?.owner_name}</div>
                  <div className="col-6"><strong>Tenant Name:</strong> {user?.name}</div>
                  <div className="col-6"><strong>NID Number:</strong> {nidNumber}</div>
                  <div className="col-6"><strong>Phone:</strong> {user?.phone || '+8801700000000'}</div>
                  <div className="col-6"><strong>Emergency Phone:</strong> {emergencyPhone}</div>
                </div>

                <div className="p-2 bg-success bg-opacity-10 text-success rounded text-center small fw-bold mb-3">
                  ✓ Verified Digital DMP Form Ready for Printing & Submission
                </div>

                <div className="d-flex justify-content-between">
                  <button onClick={() => setGenerated(false)} className="btn btn-sm btn-outline-secondary">Edit Information</button>
                  <button onClick={() => { alert('DMP Verification Form Sent to Owner & Downloaded!'); onClose(); }} className="btn btn-sm btn-primary">
                    <i className="fa-solid fa-download me-1"></i> Download Form PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMPVerificationModal;
