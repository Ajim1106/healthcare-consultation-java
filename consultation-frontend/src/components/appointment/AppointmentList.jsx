import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AppointmentCard from './AppointmentCard';
import '../../assets/styles/custom.css';

const AppointmentList = ({ appointments, userRole, onAppointmentUpdate }) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3" style={{ fontSize: '3rem' }}>📅</div>
        <h5>No appointments found</h5>
        <p className="text-muted">
          {userRole === 'patient'
            ? "You haven't booked any appointments yet."
            : "No patient appointments found."}
        </p>
      </div>
    );
  }

  return (
    <Row className="g-3">
      {appointments.map(appointment => (
        <Col key={appointment.appointmentID} md={6} lg={4}>
          <AppointmentCard
            appointment={appointment}
            userRole={userRole}
            onUpdate={onAppointmentUpdate}
          />
        </Col>
      ))}
    </Row>
  );
};

export default AppointmentList;
