import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/styles/custom.css';

const DoctorCard = ({ doctor }) => {
  const getSpecializationIcon = (specialization) => {
    const icons = {
      'Cardiology': '❤️', 'Dermatology': '🧴', 'Neurology': '🧠',
      'Pediatrics': '👶', 'Psychiatry': '🧘', 'Orthopedics': '🦴',
      'Gynecology': '🤱', 'Ophthalmology': '👁️', 'ENT': '👂',
      'General Medicine': '🩺'
    };
    return icons[specialization] || '🩺';
  };

  const availability = doctor.availability || doctor.Availability || [];

  // Show only Available slots
  const availableSlots = availability.filter(
    a => (a.status || a.Status || '').toLowerCase() === 'available'
  );

  const renderAvailability = () => {
    if (availableSlots.length === 0) {
      return <span className="text-danger small">Not available</span>;
    }
    return availableSlots.map((slot, i) => {
      // format "09:00" from "09:00:00"
      const fmt = (t) => t ? t.substring(0, 5) : '';
      return (
        <div key={i} className="small text-success">
          📅 <strong>{slot.day || slot.Day}</strong>: {fmt(slot.from || slot.From)} – {fmt(slot.to || slot.To)}
        </div>
      );
    });
  };

  const doctorId = doctor.doctorID || doctor.DoctorID;

  return (
    <Card className="doctor-card card-hover h-100">
      <Card.Body className="text-center">

        {/* Doctor image */}
        {(doctor.doctor_Image || doctor.Doctor_Image) && (
          <img
            src={doctor.doctor_Image || doctor.Doctor_Image}
            alt={doctor.name || doctor.Name}
            className="rounded-circle mb-2"
            style={{ width: 64, height: 64, objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}

        <Card.Title className="h5 mb-1">
          {doctor.name || doctor.Name || 'Doctor'}
        </Card.Title>

        {/* Specialization */}
        <div className="mb-2">
          <Badge bg="primary">
            {getSpecializationIcon(doctor.specialization || doctor.Specialization)}{' '}
            {doctor.specialization || doctor.Specialization || 'General'}
          </Badge>
        </div>

        {/* Experience */}
        <p className="text-muted small mb-2">
          🎓 {doctor.experience || doctor.Experience || '5+'}
        </p>

        {/* Availability — visible on card before opening profile */}
        <div className="mb-3 text-start px-2">
          <p className="small fw-bold mb-1">🕐 Availability:</p>
          {renderAvailability()}
        </div>

        {/* Rating */}
        <div className="mb-3">
          <span className="text-warning">⭐⭐⭐⭐⭐</span>
          <small className="text-muted ms-1">(4.8/5)</small>
        </div>

        {/* Book button */}
        <div className="d-grid">
          <Button
            as={Link}
            to={`/book-appointment/${doctorId}`}
            variant="primary"
            size="sm"
          >
            Book Appointment
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
