import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatActive, setChatActive] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch appointment details
      const appointmentData = await apiService.getAppointmentById(parseInt(appointmentId));

      if (!appointmentData) {
        throw new Error('Appointment not found');
      }

      // Verify user has access to this appointment
      console.log('🔍 Access Control Debug:', {
        userRole: user.role,
        userPatientID: user.PatientID,
        userDoctorID: user.DoctorID,
        appointmentPatientID: appointmentData.patientID,
        appointmentDoctorID: appointmentData.doctorID,
        user: user
      });

      // Verify user has access to this appointment
      if (user.role === 'patient') {
        const userPatientID = user.PatientID || user.patientID || user.patientId;
        if (appointmentData.patientID !== userPatientID) {
          throw new Error('You do not have access to this appointment');
        }
      }

      if (user.role === 'doctor') {
        const userDoctorID = user.DoctorID || user.doctorID || user.doctorId;
        if (appointmentData.doctorID !== userDoctorID) {
          throw new Error('You do not have access to this appointment');
        }
      }

      setAppointment(appointmentData);

      // Check if chat should be active
      const isToday = new Date(appointmentData.date).toDateString() === new Date().toDateString();
      const isPaid = appointmentData.paymentStatus === 'Paid';
      const isBooked = appointmentData.status === 'Booked';

      // Check if chat should be active (only during appointment time and if paid)
      setChatActive(isToday && isPaid && isBooked);

    } catch (err) {
      setError(err.message || 'Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleEndConsultation = async () => {
    try {
      await apiService.updateAppointmentStatus(parseInt(appointmentId), 'Completed');
      setChatActive(false);
      // Refresh appointment data
      await fetchAppointmentDetails();
    } catch (err) {
      console.error('Failed to end consultation:', err);
      setError('Failed to end consultation');
    }
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
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/appointments')}>
            Back to Appointments
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          <Alert.Heading>Appointment Not Found</Alert.Heading>
          <p>The requested appointment could not be found.</p>
          <Button variant="outline-warning" onClick={() => navigate('/appointments')}>
            Back to Appointments
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!chatActive) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          <Alert.Heading>Chat Not Available</Alert.Heading>
          <p>
            {appointment.status === 'Completed'
              ? 'This consultation has been completed.'
              : appointment.status === 'Cancelled'
              ? 'This appointment has been cancelled.'
              : appointment.paymentStatus !== 'Paid'
              ? 'Please complete payment to start the consultation.'
              : 'Chat is only available during your appointment time.'}
          </p>
          <Button variant="outline-warning" onClick={() => navigate('/appointments')}>
            Back to Appointments
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">
                    Consultation Chat
                  </h5>
                  <small>
                    {user.role === 'patient'
                      ? `Dr. ${appointment.doctorName || 'Doctor'}`
                      : `Patient ${appointment.patientName || 'Patient'}`} •
                    {new Date(appointment.date).toLocaleDateString()} • {appointment.timeSlot}
                  </small>
                </div>
                {user.role === 'doctor' && chatActive && (
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleEndConsultation}
                  >
                    End Consultation
                  </Button>
                )}
              </div>
            </Card.Header>

            <Card.Body className="p-0">
              <ChatWindow
                appointmentId={parseInt(appointmentId)}
                appointment={appointment}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;