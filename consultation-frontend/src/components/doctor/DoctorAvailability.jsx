import React from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import '../../assets/styles/custom.css';

const DoctorAvailability = ({ availability, onAvailabilityChange }) => {
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div>
      <h6 className="mb-4">Weekly Schedule</h6>

      {availability.map(dayAvail => (
        <Card key={dayAvail.Day} className="mb-3">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={2}>
                <h6 className="mb-0">{dayAvail.Day}</h6>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small">Status</Form.Label>
                  <Form.Select
                    size="sm"
                    value={dayAvail.Status}
                    onChange={(e) => onAvailabilityChange(dayAvail.Day, 'Status', e.target.value)}
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small">From</Form.Label>
                  <Form.Select
                    size="sm"
                    value={dayAvail.From}
                    onChange={(e) => onAvailabilityChange(dayAvail.Day, 'From', e.target.value)}
                    disabled={dayAvail.Status === 'Unavailable'}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small">To</Form.Label>
                  <Form.Select
                    size="sm"
                    value={dayAvail.To}
                    onChange={(e) => onAvailabilityChange(dayAvail.Day, 'To', e.target.value)}
                    disabled={dayAvail.Status === 'Unavailable'}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <div className="mt-4 p-3 bg-light rounded">
        <h6>Tips for setting availability:</h6>
        <ul className="small mb-0">
          <li>Set realistic time slots that you can consistently maintain</li>
          <li>Consider buffer time between appointments for notes and breaks</li>
          <li>Update your availability regularly to reflect changes in your schedule</li>
          <li>Patients can only book appointments during your available hours</li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorAvailability;