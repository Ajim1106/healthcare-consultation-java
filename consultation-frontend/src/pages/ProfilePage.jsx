import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService'; // Make sure the path is correct

const ProfilePage = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      try {
        if (user?.role === 'doctor') {
          const data = await apiService.getDoctorAvailability(user.doctorID);
          setAvailability(data);
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      }
    };

    fetchDoctorAvailability();
  }, [user]);

  if (!user) return <div className="text-center mt-5">Loading user data...</div>;

  const {
    name,
    username,
    email,
    phone,
    role,
    specialization,
    gender,
    address,
    age,
  } = user;

  const renderDoctorProfile = () => (
    <>
      <Row>
        <Col xs={5}><strong>Name:</strong></Col>
        <Col xs={7}>{name || username}</Col>
      </Row>
      <Row className="mt-2">
        <Col xs={5}><strong>Email:</strong></Col>
        <Col xs={7}>{email}</Col>
      </Row>
      <Row className="mt-2">
        <Col xs={5}><strong>Role:</strong></Col>
        <Col xs={7} className="text-capitalize">{role}</Col>
      </Row>
      {phone && (
        <Row className="mt-2">
          <Col xs={5}><strong>Phone:</strong></Col>
          <Col xs={7}>{phone}</Col>
        </Row>
      )}
      {gender && (
        <Row className="mt-2">
          <Col xs={5}><strong>Gender:</strong></Col>
          <Col xs={7}>{gender}</Col>
        </Row>
      )}
      {specialization && (
        <Row className="mt-2">
          <Col xs={5}><strong>Specialization:</strong></Col>
          <Col xs={7}>{specialization}</Col>
        </Row>
      )}
      {address && (
        <Row className="mt-2">
          <Col xs={5}><strong>Address:</strong></Col>
          <Col xs={7}>{address}</Col>
        </Row>
      )}

      {/* Doctor Availability Section */}
      {availability.length > 0 && (
        <>
          <hr />
          <h5 className="mt-4">Availability</h5>
          <ul className="list-group">
            {availability.map((slot) => (
              <li key={slot.day} className="list-group-item d-flex justify-content-between align-items-center">
                <strong>{slot.day}</strong>
                <span>
                  {slot.status === 'Available' ? `${slot.from} - ${slot.to}` : 'Unavailable'}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );

  const renderPatientProfile = () => (
    <>
      <Row>
        <Col xs={5}><strong>Name:</strong></Col>
        <Col xs={7}>{name || username}</Col>
      </Row>
      <Row className="mt-2">
        <Col xs={5}><strong>Email:</strong></Col>
        <Col xs={7}>{email}</Col>
      </Row>
      <Row className="mt-2">
        <Col xs={5}><strong>Role:</strong></Col>
        <Col xs={7} className="text-capitalize">{role}</Col>
      </Row>
      {phone && (
        <Row className="mt-2">
          <Col xs={5}><strong>Phone:</strong></Col>
          <Col xs={7}>{phone}</Col>
        </Row>
      )}
      {gender && (
        <Row className="mt-2">
          <Col xs={5}><strong>Gender:</strong></Col>
          <Col xs={7}>{gender}</Col>
        </Row>
      )}
      {age && (
        <Row className="mt-2">
          <Col xs={5}><strong>Age:</strong></Col>
          <Col xs={7}>{age}</Col>
        </Row>
      )}
      {address && (
        <Row className="mt-2">
          <Col xs={5}><strong>Address:</strong></Col>
          <Col xs={7}>{address}</Col>
        </Row>
      )}
    </>
  );

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h3 className="mb-4 text-primary">Profile</h3>
              {role === 'doctor' ? renderDoctorProfile() : renderPatientProfile()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
