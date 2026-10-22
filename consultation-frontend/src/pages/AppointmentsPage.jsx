import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import AppointmentList from '../components/appointment/AppointmentList';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, activeTab]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (user.role === 'patient') {
        data = await apiService.getAppointmentsByPatient(user.patientID);
      } else if (user.role === 'doctor') {
        data = await apiService.getAppointmentsByDoctor(user.doctorID);
      }
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    switch (activeTab) {
      case 'upcoming':
        filtered = appointments.filter(apt => apt.status === 'Booked');
        break;
      case 'completed':
        filtered = appointments.filter(apt => apt.status === 'Completed');
        break;
      case 'cancelled':
        filtered = appointments.filter(apt => apt.status === 'Cancelled');
        break;
      default:
        filtered = appointments;
    }

    setFilteredAppointments(filtered);
  };

  const getTabTitle = () => {
    if (user.role === 'patient') {
      return 'My Appointments';
    } else if (user.role === 'doctor') {
      return 'Patient Appointments';
    }
    return 'Appointments';
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">{getTabTitle()}</h2>
          </div>

          <Card>
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="all">All</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="upcoming">Upcoming</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="completed">Completed</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="cancelled">Cancelled</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <AppointmentList
                  appointments={filteredAppointments}
                  userRole={user.role}
                  onAppointmentUpdate={fetchAppointments}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentsPage;
