import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PatientRegisterForm from '../components/auth/PatientRegisterForm';

const RegisterPatient = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Patient Registration</h2>
                <p className="text-muted">Create your patient account to get started</p>
              </div>
              <PatientRegisterForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPatient;