import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center text-center">
        <Col md={6}>
          <div className="mb-4" style={{ fontSize: '6rem' }}>🔍</div>
          <h1 className="display-4 fw-bold mb-3">Page Not Found</h1>
          <p className="lead text-muted mb-4">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button as={Link} to="/" variant="primary" size="lg">
              Go Home
            </Button>
            <Button as={Link} to="/search-doctors" variant="outline-primary" size="lg">
              Find Doctors
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;