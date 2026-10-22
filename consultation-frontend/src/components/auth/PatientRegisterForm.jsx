import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/apiService';

const PatientRegisterForm = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    confirmPassword: '',
    Gender: '',
    DOB: '',
    ContactNumber: '',
    MedicalHistory: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerPatient } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const isValidIndianMobileNumber = (number) => {
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(number);
  };

  const isStrongPassword = (password) => {
    // At least 8 chars, one uppercase, one lowercase, one digit, one special char (any)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/;
    return emailRegex.test(email);
  };

  const isValidDOB = (dob) => {
    const selectedDate = new Date(dob);
    const today = new Date();

    // Calculate the latest valid DOB (must be at least 16 years old)
    const minDOB = new Date();
    minDOB.setFullYear(today.getFullYear() - 16);

    return selectedDate <= minDOB && selectedDate <= today;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'Gender' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isValidEmail(formData.Email)) {
      setError('Please enter a valid email (e.g. devyani@gmail.com). Only Gmail, Yahoo, and Hotmail are allowed.');
      setLoading(false);
      return;
    }

    if (!isValidDOB(formData.DOB)) {
      setError('You must be at least 16 years old to register.');
      setLoading(false);
      return;
    }

    if (formData.Password !== formData.confirmPassword) {
      setError('Passwords do not match.');
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
      const normalizedEmail = formData.Email.trim().toLowerCase();
      const emailExists = await apiService.checkPatientEmailExists(normalizedEmail);
      if (emailExists) {
        setError('This email is already registered. Please login.');
        setLoading(false);
        return;
      }

      const patientData = {
        ...formData,
        Email: normalizedEmail
      };
      delete patientData.confirmPassword;

      await registerPatient(patientData);
      showToast('Registration successful! Please login to continue.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

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
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
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
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Other</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]} // restricts to today or earlier
              required
            />
          </Form.Group>
        </Col>
      </Row>

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

      <Form.Group className="mb-4">
        <Form.Label>Medical History (Optional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="MedicalHistory"
          value={formData.MedicalHistory}
          onChange={handleChange}
          placeholder="Enter any relevant medical history"
        />
      </Form.Group>

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
    </Form>
  );
};

export default PatientRegisterForm;