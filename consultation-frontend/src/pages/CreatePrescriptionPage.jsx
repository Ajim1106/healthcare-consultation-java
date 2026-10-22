import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import PrescriptionForm from '../components/prescription/PrescriptionForm';

const CreatePrescriptionPage = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const appointmentData = await apiService.getAppointmentById(parseInt(appointmentId));

      if (!appointmentData) {
        throw new Error('Appointment not found');
      }

      // Check if appointment is completed
      if (appointmentData.status !== 'Completed') {
        throw new Error('Prescription can only be created for completed appointments');
      }

      // Check if prescription already exists
      try {
        const existingPrescriptions = await apiService.getPrescriptionByAppointment(parseInt(appointmentId));
        if (existingPrescriptions && existingPrescriptions.length > 0) {
          throw new Error('Prescription already exists for this appointment');
        }
      } catch (error) {
        if (error.message.includes('Prescription already exists')) {
          throw error;
        }
        // If it's a 404 error (no prescription found), that's fine
        console.log('No existing prescription found');
      }

      // Verify user is a doctor and has access to this appointment
      if (user.role !== 'doctor') {
        throw new Error('Only doctors can create prescriptions');
      }

      const userDoctorID = user.DoctorID || user.doctorID || user.doctorId;
      if (appointmentData.doctorID !== userDoctorID) {
        throw new Error('You do not have access to this appointment');
      }

      setAppointment(appointmentData);

    } catch (err) {
      setError(err.message || 'Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionCreated = () => {
    // Show success message and redirect
    alert('Prescription created successfully!');
    navigate('/appointments');
  };

  const handleCancel = () => {
    navigate('/appointments');
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

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <div className="mb-4">
            <h3>Create Prescription</h3>
            <p className="text-muted">
              Creating prescription for appointment #{appointment.appointmentID} • Patient: {appointment.patientName || `Patient #${appointment.patientID}`}
            </p>
          </div>

          {/* Appointment Details */}
          <div className="mb-4">
            <h5>Appointment Details</h5>
            <div className="card">
              <div className="card-body">
                <p><strong>Patient:</strong> {appointment.patientName}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.timeSlot}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </div>
            </div>
          </div>

          {/* Prescription Form */}
          <PrescriptionForm
            appointment={appointment}
            onPrescriptionCreated={handlePrescriptionCreated}
            onCancel={handleCancel}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePrescriptionPage;
