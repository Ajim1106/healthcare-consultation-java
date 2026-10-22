import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import AppointmentForm from '../components/appointment/AppointmentForm';
import { useAuth } from '../context/AuthContext';

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!doctorId) {
      navigate('/find-doctors');
      return;
    }

    const fetchDoctor = async () => {
      try {
        const doctorData = await apiService.getDoctorById(doctorId);
        setDoctor(doctorData);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Doctor not found');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, navigate, user]);

  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) return 'Not available';
    return availability.map((slot, index) => (
      <div key={index}>
        {slot.day}: {slot.from} - {slot.to} ({slot.status})
      </div>
    ));
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <img
                src={doctor?.doctor_Image || '/default-doctor.jpg'}
                alt={doctor?.name || 'Doctor'}
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h4>{doctor?.name}</h4>
              <p className="text-muted">{doctor?.specialization}</p>
              <p className="small">
                <strong>Experience:</strong> {doctor?.experience || '5+'} years<br />
                <strong>Availability:</strong> {formatAvailability(doctor?.availability)}
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Book Appointment</h5>
            </Card.Header>
            <Card.Body>
              <AppointmentForm doctor={doctor} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointmentPage;