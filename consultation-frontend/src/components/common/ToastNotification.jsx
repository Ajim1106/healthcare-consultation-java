import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';


const ToastNotification = () => {
  const { toasts, removeToast } = useApp();

  const getToastVariant = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          show={true}
          onClose={() => removeToast(toast.id)}
          bg={getToastVariant(toast.type)}
          delay={toast.duration}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default ToastNotification;