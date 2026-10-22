import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';

const AvailabilityPage = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { showToast } = useApp();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['09:00 - 12:00', '12:00 - 16:00', '16:00 - 20:00', '20:00 - 23:00'];

  const handleSaveAvailability = async () => {
    if (!selectedDay || !selectedTime) {
      setError('Please select both day and time slot.');
      return;
    }

    const [from, to] = selectedTime.split(' - ');

    const availabilityList = [{
      day: selectedDay,
      from: from.trim(),
      to: to.trim()
    }];

    setSaving(true);
    setError('');

    try {
      await apiService.updateDoctorAvailability(user.doctorID, availabilityList);
      showToast('Availability updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update availability.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card>
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <Form.Group controlId="formDay">
                    <Form.Label>Day</Form.Label>
                    <Form.Select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                      <option value="">Select Day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formTime">
                    <Form.Label>Availability Time</Form.Label>
                    <Form.Select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                      <option value="">Select Time Slot</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Button variant="success" onClick={handleSaveAvailability} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AvailabilityPage;
