import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../assets/styles/custom.css';


const Footer = () => {
  return (
    <footer className="footer mt-5" id="contact">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="text-white mb-3">TeleMed</h5>
            <p className="text-light">
              Your trusted healthcare partner providing quality medical consultations
              from the comfort of your home.
            </p>
          </Col>
          <Col md={2}>
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/search-doctors" className="text-light text-decoration-none">Find Doctors</Link></li>
              <li><Link to="/login" className="text-light text-decoration-none">Login</Link></li>
              <li><Link to="/register-patient" className="text-light text-decoration-none">Register</Link></li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="text-white mb-3">Services</h6>
            <ul className="list-unstyled">
              <li className="text-light">Online Consultations</li>
              <li className="text-light">Prescription Management</li>
              <li className="text-light">Health Records</li>
              <li className="text-light">24/7 Support</li>
            </ul>
          </Col>
          <Col md={3}>
            <h6 className="text-white mb-3">Contact Info</h6>
            <p className="text-light mb-1">📧 support@telemed.com</p>
            <p className="text-light mb-1">📞 +1 (555) 123-4567</p>
            <p className="text-light mb-1">🏥 Healthcare Excellence</p>
          </Col>
        </Row>
        <hr className="my-4 bg-light" />
        <Row>
          <Col className="text-center">
            <p className="text-light mb-0">
              © 2024 TeleMed. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;