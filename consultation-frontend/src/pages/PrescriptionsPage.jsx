import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';
import ViewPrescriptionModal from '../components/prescription/ViewPrescriptionModal';

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const { user } = useAuth();
  const { showToast } = useApp();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      let data;
      if (user.role === 'patient') {
        data = await apiService.getPrescriptions(user.PatientID);
      } else if (user.role === 'doctor') {
        data = await apiService.getPrescriptions(null, user.DoctorID);
      }

      setPrescriptions(data);
    } catch (err) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedPrescription(null);
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <div className="mb-4">
            <h2 className="fw-bold">Prescriptions</h2>
            <p className="text-muted">
              {user.role === 'patient' ? 'Your digital prescriptions' : 'Manage patient prescriptions'}
            </p>
            {user.role === 'doctor' && (
              <p className="text-info small">
                💡 To create a prescription, go to your appointments and click "Create Prescription" on completed appointments.
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : prescriptions.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '3rem' }}>💊</div>
                <h5>No prescriptions found</h5>
                <p className="text-muted">
                  {user.role === 'patient'
                    ? "You don't have any prescriptions yet."
                    : "No prescriptions created yet."}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {prescriptions.map(prescription => (
                <Col key={prescription.PrescriptionID} md={6} lg={4}>
                  <Card className="h-100 card-hover">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="mb-0">
                          Prescription #{prescription.PrescriptionID}
                        </h6>
                        <span className="badge bg-success">Active</span>
                      </div>

                      <p className="mb-2">
                        <strong>Date Issued:</strong> {formatDate(prescription.DateIssued)}
                      </p>

                      <p className="mb-2">
                        <strong>Doctor:</strong> {prescription.doctorName || prescription.DoctorName}
                      </p>

                      {user.role === 'doctor' && (
                        <p className="mb-2">
                          <strong>Patient:</strong> {prescription.patientName || prescription.PatientName}
                        </p>
                      )}

                      <p className="mb-3">
                        <strong>Medication:</strong><br/>
                        <small className="text-muted">{prescription.MedicationDetails}</small>
                      </p>

                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewPrescription(prescription)}
                        >
                          👁️ View Details
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => window.open(prescription.FilePath, '_blank')}
                        >
                          📄 Download PDF
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* View Prescription Modal */}
      <ViewPrescriptionModal
        show={showViewModal}
        onHide={handleCloseModal}
        prescription={selectedPrescription}
        userRole={user.role}
      />
    </Container>
  );
};

export default PrescriptionsPage;