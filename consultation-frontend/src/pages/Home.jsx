import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import DoctorCard from '../components/doctor/DoctorCard';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [originalDoctors, setOriginalDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', specialization: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiService.getDoctors();
        setOriginalDoctors(data || []);
        setDoctors(data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, originalDoctors]);

  const applyFilters = () => {
    let filtered = [...originalDoctors];

    if (filters.name.trim()) {
      const name = filters.name.toLowerCase();
      filtered = filtered.filter(doc =>
        (doc.name || doc.Name || '').toLowerCase().includes(name)
      );
    }

    if (filters.specialization.trim()) {
      const spec = filters.specialization.toLowerCase();
      filtered = filtered.filter(doc =>
        (doc.specialization || doc.Specialization || '').toLowerCase().includes(spec)
      );
    }

    setDoctors(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClearFilters = () => {
    setFilters({ name: '', specialization: '' });
  };

  const specializations = [
    'All Specializations',
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry',
    'Orthopedics', 'Gynecology', 'Ophthalmology', 'ENT', 'General Medicine'
  ];

  const shouldShowFindDoctors = () => {
    return isAuthenticated && user?.role === 'patient';
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Your Health, Our Priority
              </h1>
              <p className="lead mb-4">
                Connect with certified doctors from the comfort of your home.
                Get quality healthcare consultations, prescriptions, and medical
                advice through our secure telemedicine platform.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {shouldShowFindDoctors() ? (
                  <Button as={Link} to="/search-doctors" size="lg" variant="light">
                    Find Doctors
                  </Button>
                ) : !isAuthenticated ? (
                  <>
                    <Button as={Link} to="/register-patient" size="lg" variant="light">
                      Book Appointment
                    </Button>
                    <Button as={Link} to="/login" size="lg" variant="outline-light">
                      Login
                    </Button>
                  </>
                ) : null}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Healthcare Professional"
                className="img-fluid rounded-3 shadow"
                style={{ maxHeight: '400px' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <Container className="my-5 py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-5 fw-bold">Our Services</h2>
            <p className="lead text-muted">Comprehensive healthcare solutions at your fingertips</p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card className="card-hover h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🩺</div>
                <Card.Title>Online Consultations</Card.Title>
                <Card.Text>
                  Connect with certified doctors for video consultations and
                  get medical advice from anywhere.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="card-hover h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>💊</div>
                <Card.Title>Digital Prescriptions</Card.Title>
                <Card.Text>
                  Receive digital prescriptions that you can download and
                  use at any pharmacy.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="card-hover h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>📱</div>
                <Card.Title>Secure Messaging</Card.Title>
                <Card.Text>
                  Communicate securely with your healthcare providers through
                  our encrypted messaging system.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>


      {/* <section className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">500+</h3>
              <p className="lead">Certified Doctors</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">10K+</h3>
              <p className="lead">Happy Patients</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">25+</h3>
              <p className="lead">Specializations</p>
            </Col>
            <Col md={3} className="mb-4">
              <h3 className="display-4 fw-bold text-primary">24/7</h3>
              <p className="lead">Support Available</p>
            </Col>
          </Row>
        </Container>
      </section> */}

      {/* CTA Section */}
      <Container className="my-5 py-5 text-center">
        <Row>
          <Col lg={8} className="mx-auto">
            <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
            <p className="lead mb-4">
              Join thousands of patients who trust our platform for their healthcare needs.
            </p>
            {!isAuthenticated && (
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button as={Link} to="/register-patient" size="lg" variant="primary">
                  Register as Patient
                </Button>
                <Button as={Link} to="/register-doctor" size="lg" variant="outline-primary">
                  Join as Doctor
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* All Doctors + Filters Section */}
      <section className="bg-white py-5">
        <Container>
          <h2 className="mb-4 text-center">Meet Our Doctors</h2>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search by Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter doctor's name"
                  value={filters.name}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Specialization</Form.Label>
                <Form.Select
                  name="specialization"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                >
                  {specializations.map(spec => (
                    <option key={spec} value={spec === 'All Specializations' ? '' : spec}>
                      {spec}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : doctors.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <h5>No doctors found</h5>
                <p className="text-muted mb-3">Try adjusting your search or filters.</p>
                <Button variant="primary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {doctors.map((doctor, index) => (
                <Col key={index}>
                  <DoctorCard doctor={doctor} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Home;
