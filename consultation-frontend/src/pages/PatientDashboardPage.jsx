import React from 'react';
import { Container } from 'react-bootstrap';
import PatientDashboard from '../components/dashboard/PatientDashboard';

const PatientDashboardPage = () => {
  return (
    <Container className="my-4">
      <PatientDashboard />
    </Container>
  );
};

export default PatientDashboardPage;