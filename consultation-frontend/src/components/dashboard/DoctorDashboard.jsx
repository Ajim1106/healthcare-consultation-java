import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const allAppointments = await apiService.getBookedAppointmentsByDoctor(user.doctorID);

      const todayAppointments = allAppointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      });

      setAppointments(todayAppointments);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return [hours, minutes];
  };

  const isCurrentAppointmentSlot = (appointment) => {
    if (!appointment.date || !appointment.timeSlot) return false;

    const now = new Date();
    const isoDateOnly = appointment.date.split('T')[0];
    const [year, month, day] = isoDateOnly.split('-').map(Number);

    const [startRaw, endRaw] = appointment.timeSlot.split(' - ').map(t => t.trim());
    const [startH, startM] = parseTime(startRaw);
    const [endH, endM] = parseTime(endRaw);

    const startDateTime = new Date(year, month - 1, day, startH, startM);
    const endDateTime = new Date(year, month - 1, day, endH, endM);

    return now >= startDateTime && now <= endDateTime;
  };

  const canStartChat = (appointment) => {
    return appointment.status === 'Booked' && isCurrentAppointmentSlot(appointment);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Welcome, {user.name}!</h2>
          <p className="text-muted">Manage your practice and patient consultations</p>
        </div>
      </div>

      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>📋</div>
              <Card.Title>All Appointments</Card.Title>
              <Card.Text>View and manage appointments</Card.Text>
              <Button as={Link} to="/appointments" variant="primary" size="sm">View All</Button>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={4}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>⏰</div>
              <Card.Title>Availability</Card.Title>
              <Card.Text>Set your available hours</Card.Text>
              <Button as={Link} to="/availability" variant="outline-primary" size="sm">Manage</Button>
            </Card.Body>
          </Card>
        </Col> */}
        <Col md={4}>
          <Card className="card-hover text-center h-100">
            <Card.Body>
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>👤</div>
              <Card.Title>Profile</Card.Title>
              <Card.Text>Update your profile information</Card.Text>
              <Button as={Link} to="/profile" variant="outline-primary" size="sm">Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Today's Appointments</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : appointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="row g-3">
                  {appointments.map(appointment => (
                    <div key={appointment.appointmentID} className="col-md-6">
                      <Card className="appointment-card">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="mb-1">{appointment.patientName}</h6>
                              <p className="text-muted small mb-0">🕐 {appointment.timeSlot}</p>
                            </div>
                            <Badge bg={appointment.status === 'Completed' ? 'success' : 'primary'}>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="d-flex gap-2">
                            {canStartChat(appointment) && (
                              <>
                                <Button as={Link} to={`/chat/${appointment.appointmentID}`} variant="primary" size="sm">Start Chat</Button>
                                <Button variant="outline-primary" size="sm">Create Prescription</Button>
                              </>
                            )}
                            {appointment.status === 'Completed' && (
                              <Button variant="outline-secondary" size="sm" disabled>Completed</Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DoctorDashboard;
