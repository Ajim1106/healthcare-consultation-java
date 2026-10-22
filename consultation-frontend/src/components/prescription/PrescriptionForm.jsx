import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import apiService from '../../services/apiService';

const PrescriptionForm = ({ appointment, onPrescriptionCreated, onCancel }) => {
  const [prescription, setPrescription] = useState({
    medicationDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const prescriptionData = {
        appointmentID: appointment.appointmentID,
        patientID: appointment.patientID,
        doctorID: appointment.doctorID,
        medicationDetails: prescription.medicationDetails
      };

      console.log('📝 Creating prescription:', prescriptionData);
      await apiService.createPrescription(prescriptionData);

      console.log('✅ Prescription created successfully');
      alert('Prescription created successfully!');
      onPrescriptionCreated();
    } catch (err) {
      console.error('❌ Failed to create prescription:', err);
      setError('Failed to create prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Create Prescription</h5>
        <small>Appointment #{appointment.appointmentID} • Patient: {appointment.patientName || `Patient #${appointment.patientID}`}</small>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><strong>Medication Details</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              value={prescription.medicationDetails}
              onChange={(e) => setPrescription({ ...prescription, medicationDetails: e.target.value })}
              placeholder="Enter medication details, dosage, instructions, and any additional notes..."
              required
            />
            <Form.Text className="text-muted">
              Include medication names, dosages, frequency, duration, and any special instructions.
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Prescription'}
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PrescriptionForm;
