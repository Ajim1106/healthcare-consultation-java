import React from 'react';
import { Container } from 'react-bootstrap';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <Container className="my-4">
      <AdminDashboard />
    </Container>
  );
};

export default AdminDashboardPage;