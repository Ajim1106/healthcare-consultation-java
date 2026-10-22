import React from 'react';
import { Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import '../../assets/styles/custom.css';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={toggleDarkMode}
      className="me-2"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </Button>
  );
};

export default DarkModeToggle;