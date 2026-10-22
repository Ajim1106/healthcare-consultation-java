import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/apiService';
import '../../assets/styles/custom.css';

const DoctorRegisterForm = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    confirmPassword: '',
    Specialization: '',
    Experience: '',
    ContactNumber: '',
    Day: '',
    From: '',
    To: '',
    Status: 'Available'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerDoctor } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const isValidIndianMobileNumber = (number) => /^[6-9]\d{9}$/.test(number);

  const isStrongPassword = (password) =>
    // At least 8 chars, one uppercase, one lowercase, one digit, one special char (any)
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

  // ✅ Updated email validation (same as patient form)
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/;
    return emailRegex.test(email);
  };

  const isValidExperience = (experience) => {
    const exp = parseInt(experience);
    return exp >= 5 && exp <= 50;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = formData.Email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError(
        'Please enter a valid email (e.g. doctor@gmail.com). Only Gmail, Yahoo, and Hotmail are allowed.'
      );
      setLoading(false);
      return;
    }

    if (!isValidExperience(formData.Experience)) {
      setError('Experience must be at least 5 years and cannot exceed 50 years.');
      setLoading(false);
      return;
    }

    if (formData.Password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isStrongPassword(formData.Password)) {
      setError(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      );
      setLoading(false);
      return;
    }

    if (!isValidIndianMobileNumber(formData.ContactNumber)) {
      setError('Contact number must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      setLoading(false);
      return;
    }

    try {
      const emailExists = await apiService.checkDoctorEmailExists(normalizedEmail);
      if (emailExists) {
        setError('This email is already registered. Please login.');
        setLoading(false);
        return;
      }

      const doctorData = {
        Name: formData.Name,
        Email: normalizedEmail,
        Password: formData.Password,
        Specialization: formData.Specialization,
        Experience: parseInt(formData.Experience),
        ContactNumber: formData.ContactNumber,
        ProfileStatus: 'Pending',
        Doctor_Image: '',
        Availabilities: [
          {
            Day: formData.Day,
            From: formData.From,
            To: formData.To,
            Status: formData.Status
          }
        ]
      };

      await registerDoctor(doctorData);
      showToast('Registration successful! Your account is pending approval.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry',
    'Orthopedics', 'Gynecology', 'Ophthalmology', 'ENT', 'General Medicine'
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    { label: 'Morning (08:00 - 12:00)', from: '08:00:00', to: '12:00:00' },
    { label: 'Afternoon (12:00 - 16:00)', from: '12:00:00', to: '16:00:00' },
    { label: 'Evening (16:00 - 20:00)', from: '16:00:00', to: '20:00:00' },
    { label: 'Full Day (09:00 - 17:00)', from: '09:00:00', to: '17:00:00' }
  ];

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Dr. John Doe"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Specialization</Form.Label>
            <Form.Select
              name="Specialization"
              value={formData.Specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialization</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Experience (years) - Minimum 5 years required</Form.Label>
            <Form.Control
              type="number"
              name="Experience"
              value={formData.Experience}
              onChange={handleChange}
              placeholder="Enter experience (5-50 years)"
              min="5"
              max="50"
              required
            />
            <Form.Text className="text-muted">
              Minimum 5 years of experience required
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="tel"
              name="ContactNumber"
              value={formData.ContactNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Day</Form.Label>
            <Form.Select
              name="Day"
              value={formData.Day}
              onChange={handleChange}
              required
            >
              <option value="">Select Day</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Availability Time</Form.Label>
            <Form.Select
              onChange={(e) => {
                const [from, to] = e.target.value.split(',');
                setFormData(prev => ({ ...prev, From: from, To: to }));
              }}
              required
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map(slot => (
                <option key={slot.label} value={`${slot.from},${slot.to}`}>
                  {slot.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-100 mb-3"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>

      <div className="text-center">
        <p className="mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none">
            Sign In
          </Link>
        </p>
      </div>

      <Alert variant="info" className="mt-3">
        <small>
          Your account will be reviewed by our admin team. You'll be notified once approved.
        </small>
      </Alert>
    </Form>
  );
};

export default DoctorRegisterForm;
