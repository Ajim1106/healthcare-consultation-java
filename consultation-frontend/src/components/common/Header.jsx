import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import '../../assets/styles/custom.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';

    switch (user.role) {
      case 'patient':
        return '/patient-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  const getDisplayName = () => {
    return (
      user?.name ||
      user?.Name ||
      user?.username ||
      user?.Username ||
      'User'
    );
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <img
            src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
            alt="TeleMed"
            className="me-2"
          />
          TeleMed
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {/* <Nav.Link as={Link} to="/">About</Nav.Link> */}
            <Nav.Link as="a" href="#contact">Contact</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to={getDashboardLink()}>Dashboard</Nav.Link>
                {user.role === 'patient' && (
                  <>
                    <Nav.Link as={Link} to="/search-doctors">Find Doctors</Nav.Link>
                    <Nav.Link as={Link} to="/appointments">My Appointments</Nav.Link>
                    <Nav.Link as={Link} to="/prescriptions">Prescriptions</Nav.Link>
                  </>
                )}
                {user.role === 'doctor' && (
                  <>
                    <Nav.Link as={Link} to="/appointments">Appointments</Nav.Link>
                    {/* <Nav.Link as={Link} to="/availability">Availability</Nav.Link> */}
                    <Nav.Link as={Link} to="/prescriptions">Prescriptions</Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>

          <Nav className="align-items-center">
            {/* <DarkModeToggle /> */}
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="primary" id="user-dropdown">
                  {getDisplayName()}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-outline-primary me-2">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register-patient" className="btn btn-primary">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
