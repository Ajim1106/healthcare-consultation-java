import React from 'react';
import { Container } from 'react-bootstrap';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';

const DoctorDashboardPage = () => {
  return (
    <Container className="my-4">
      <DoctorDashboard />
    </Container>
  );
};

export default DoctorDashboardPage;