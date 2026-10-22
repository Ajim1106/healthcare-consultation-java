import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiService.getDashboardStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">System overview and management</p>
        </div>
      </div>

      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>👥</div>
              <h3>{stats.totalPatients}</h3>
              <small>Total Patients</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>👨‍⚕️</div>
              <h3>{stats.totalDoctors}</h3>
              <small>Total Doctors</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>📅</div>
              <h3>{stats.totalAppointments}</h3>
              <small>Total Appointments</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>🧑‍⚕️</div>
              <h3>{stats.pendingApprovals}</h3>
              <small>Pending Approvals</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-5 justify-content-center">
        <Col md={6}>
          <Card className="card-hover h-100 text-center">
            <Card.Body>
              <div style={{ fontSize: '3rem' }}>🕐</div>
              <Card.Title>Doctor Approvals</Card.Title>
              <Card.Text>{stats.pendingApprovals} doctors pending</Card.Text>
              <Button size="sm" onClick={() => navigate('/admin/approvals')}>
                Review Approvals
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
