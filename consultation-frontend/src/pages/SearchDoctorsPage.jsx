import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import apiService from '../services/apiService';
import DoctorCard from '../components/doctor/DoctorCard';

const SearchDoctorsPage = () => {
  const [originalDoctors, setOriginalDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    specialization: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, originalDoctors]);

  const fetchDoctors = async () => {

  //   const rawUser = localStorage.getItem('currentUser');
  // const token = localStorage.getItem('token'); // ✅ get token directly

  // console.log("🔍 Raw localStorage user:", rawUser);
  // console.log("📦 Token before fetching doctors:", token);

  // let userData = null;

  // try {
  //   userData = JSON.parse(rawUser);
  // } catch (error) {
  //   console.error("❌ Failed to parse user:", error);
  // }

    try {
      const data = await apiService.getDoctors();
      console.log('Fetched doctors:', data);
      setOriginalDoctors(data || []);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Find Doctors</h2>
          <p className="text-muted">Search and connect with healthcare professionals</p>
        </Col>
      </Row>

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

      <Row>
        <Col>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
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
            <Row className="g-4">
              {doctors.map(doctor => (
                <Col key={doctor.doctorID || doctor.DoctorID} md={6} lg={4}>
                  <DoctorCard doctor={doctor} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchDoctorsPage;
