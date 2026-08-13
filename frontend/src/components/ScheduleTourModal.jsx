import React, { useState } from 'react';

const ScheduleTourModal = ({ property, show, onClose, onScheduleSuccess }) => {
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('10:00 AM');
  const [note, setNote] = useState('');

  if (!show || !property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onScheduleSuccess(`Tour scheduled for ${property.title} on ${tourDate} at ${tourTime}!`);
    onClose();
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--glass-bg)', backdropFilter: 'blur(30px)' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <i className="fa-solid fa-calendar-check text-primary me-2"></i>Schedule a Viewing
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="text-secondary small mb-3">
                Book an in-person site visit for <strong>{property.title}</strong> in {property.location}.
              </p>

              <div className="mb-3">
                <label className="form-label-custom">Preferred Date</label>
                <input
                  type="date"
                  className="form-control form-control-custom"
                  required
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Preferred Time Slot</label>
                <select
                  className="form-select form-control-custom"
                  value={tourTime}
                  onChange={(e) => setTourTime(e.target.value)}
                >
                  <option value="10:00 AM">10:00 AM - Morning</option>
                  <option value="02:00 PM">02:00 PM - Afternoon</option>
                  <option value="05:00 PM">05:00 PM - Evening</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label-custom">Additional Note (Optional)</label>
                <textarea
                  className="form-control form-control-custom"
                  rows="2"
                  placeholder="e.g., Please confirm if parking spot is available."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-secondary-custom" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary-custom">Confirm Booking</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTourModal;
