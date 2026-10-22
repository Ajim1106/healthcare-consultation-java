import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import DoctorRegisterForm from '../components/auth/DoctorRegisterForm';

const RegisterDoctor = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Doctor Registration</h2>
                <p className="text-muted">
                  Join our network of healthcare professionals
                </p>
              </div>

              {/* You can pass props or handle form callbacks if needed */}
              <DoctorRegisterForm />

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterDoctor;
