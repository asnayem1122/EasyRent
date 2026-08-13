import React from 'react';

const Toast = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container-custom">
      {toasts.map(toast => (
        <div key={toast.id} className="toast-item">
          <i className={toast.icon || 'fa-solid fa-circle-check'} style={{ color: toast.color || 'var(--primary-color)' }}></i>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
