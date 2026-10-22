import React from 'react';
import { Modal, Button, Card, Alert } from 'react-bootstrap';

const ViewPrescriptionModal = ({ show, onHide, prescription, userRole }) => {
  // Debug logging
  console.log('🔍 ViewPrescriptionModal - Received prescription:', prescription);
  console.log('🔍 ViewPrescriptionModal - Prescription keys:', prescription ? Object.keys(prescription) : 'No prescription');

  if (!prescription) {
    return (
      <Modal show={show} onHide={onHide} size="md" centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>No Prescription Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <p>No prescription found for this appointment.</p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>💊 Prescription</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Card className="mb-3">
          <Card.Body>
            <h6 className="text-primary mb-3">Prescription Details</h6>

            <div className="mb-3">
              <strong>Prescription ID:</strong> {prescription.prescriptionID || prescription.PrescriptionID}
            </div>

            <div className="mb-3">
              <strong>Date Issued:</strong> {prescription.dateIssued || prescription.DateIssued ?
                new Date(prescription.dateIssued || prescription.DateIssued).toLocaleDateString() : 'N/A'}
            </div>

            <div className="mb-3">
              <strong>Doctor:</strong> {(() => {
                console.log('🔍 Doctor object:', prescription.Doctor);
                console.log('🔍 Doctor properties:', prescription.Doctor ? Object.keys(prescription.Doctor) : 'No Doctor object');
                return prescription.doctorName || prescription.DoctorName || prescription.Doctor?.name || prescription.Doctor?.Name || prescription.doctor?.name || prescription.doctor?.Name || `Dr. #${prescription.doctorID || prescription.DoctorID}`;
              })()}
            </div>

            <div className="mb-3">
              <strong>Patient:</strong> {(() => {
                console.log('🔍 Patient object:', prescription.Patient);
                console.log('🔍 Patient properties:', prescription.Patient ? Object.keys(prescription.Patient) : 'No Patient object');
                return prescription.patientName || prescription.PatientName || prescription.Patient?.name || prescription.Patient?.Name || prescription.patient?.name || prescription.patient?.Name || `Patient #${prescription.patientID || prescription.PatientID}`;
              })()}
            </div>



            <div className="mb-3">
              <strong>Medication Details:</strong>
              <div className="mt-2 p-3 bg-light border rounded">
                {prescription.medicationDetails || prescription.MedicationDetails || 'No medication details available'}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewPrescriptionModal;
