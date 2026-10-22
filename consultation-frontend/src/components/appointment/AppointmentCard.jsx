import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import ViewPrescriptionModal from '../prescription/ViewPrescriptionModal';

const AppointmentCard = ({ appointment, userRole, onUpdate }) => {
  const [doctorName, setDoctorName] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Booked':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusVariant = (status) => {
    return status === 'Paid' ? 'success' : 'warning';
  };

  const parseTime = (timeStr) => {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return [hours, minutes];
  };

  const isCurrentAppointmentSlot = () => {
    if (!appointment.date || !appointment.timeSlot) return false;

    const now = new Date();
    const isoDateOnly = appointment.date.split('T')[0]; // "YYYY-MM-DD"
    const [year, month, day] = isoDateOnly.split('-').map(Number);

    const [startRaw, endRaw] = appointment.timeSlot.split(' - ').map(t => t.trim());
    const [startH, startM] = parseTime(startRaw);
    const [endH, endM] = parseTime(endRaw);

    const startDateTime = new Date(year, month - 1, day, startH, startM);
    const endDateTime = new Date(year, month - 1, day, endH, endM);

    const isSameDay = now.toDateString() === startDateTime.toDateString();
    const isInTimeRange = now >= startDateTime && now <= endDateTime;

    console.log('▶️ Start:', startDateTime.toLocaleString());
    console.log('⏹ End:', endDateTime.toLocaleString());
    console.log('🕒 Now:', now.toLocaleString());
    console.log('📅 Same Day:', isSameDay);
    console.log('⏰ Within Time Range:', isInTimeRange);

    return isSameDay && isInTimeRange;
  };

  const canStartChat = () => {
    // Check if it's the exact appointment time and day
    const isCurrentAppointmentSlot = () => {
      if (!appointment.date || !appointment.timeSlot) return false;

      const now = new Date();
      const isoDateOnly = appointment.date.split('T')[0]; // "YYYY-MM-DD"
      const [year, month, day] = isoDateOnly.split('-').map(Number);

      const [startRaw, endRaw] = appointment.timeSlot.split(' - ').map(t => t.trim());
      const [startH, startM] = parseTime(startRaw);
      const [endH, endM] = parseTime(endRaw);

      const startDateTime = new Date(year, month - 1, day, startH, startM);
      const endDateTime = new Date(year, month - 1, day, endH, endM);

      const isSameDay = now.toDateString() === startDateTime.toDateString();
      const isInTimeRange = now >= startDateTime && now <= endDateTime;

      console.log('▶️ Start:', startDateTime.toLocaleString());
      console.log('⏹ End:', endDateTime.toLocaleString());
      console.log('🕒 Now:', now.toLocaleString());
      console.log('📅 Same Day:', isSameDay);
      console.log('⏰ Within Time Range:', isInTimeRange);

      return isSameDay && isInTimeRange;
    };

    // For doctors, allow chat if appointment is booked and within the exact time slot
    // For patients, require payment to be paid and within the exact time slot
    const allowed = userRole === 'doctor'
      ? appointment.status === 'Booked' && isCurrentAppointmentSlot()
      : appointment.status === 'Booked' && appointment.paymentStatus === 'Paid' && isCurrentAppointmentSlot();

    console.log('💬 Can Start Chat Debug:', {
      userRole: userRole,
      status: appointment.status,
      paymentStatus: appointment.paymentStatus,
      isCurrentSlot: isCurrentAppointmentSlot(),
      allowed: allowed
    });
    return allowed;
  };

  const updateAppointmentStatusIfExpired = async () => {
    if (!appointment.date || !appointment.timeSlot) return;

    const now = new Date();
    const isoDateOnly = appointment.date.split('T')[0];
    const [year, month, day] = isoDateOnly.split('-').map(Number);

    const [_, endRaw] = appointment.timeSlot.split(' - ').map(t => t.trim());
    const [endH, endM] = parseTime(endRaw);
    const endDateTime = new Date(year, month - 1, day, endH, endM);

    const shouldCancel =
      now > endDateTime &&
      appointment.status === 'Booked' &&
      appointment.paymentStatus === 'Paid';

    if (shouldCancel) {
      try {
        console.log('⚠️ Appointment expired. Auto-cancelling...');
        await apiService.updateAppointmentStatus(appointment.appointmentID, 'Cancelled');
        if (onUpdate) onUpdate(); // Notify parent to refresh list
      } catch (error) {
        console.error('❌ Failed to auto-cancel appointment:', error.message);
      }
    }
  };

  const handleCompleteConsultation = async () => {
    try {
      await apiService.updateAppointmentStatus(appointment.appointmentID, 'Completed');
      // Refresh the appointment data or trigger a callback
      if (onUpdate) {
        onUpdate();
      }
      alert('Consultation marked as completed!');
    } catch (error) {
      console.error('Error completing consultation:', error);
      alert('Failed to complete consultation. Please try again.');
    }
  };

  const handleViewPrescription = async () => {
    try {
      console.log('🔍 Debug - Appointment ID:', appointment.appointmentID);
      console.log('🔍 Debug - Appointment Details:', appointment);
      console.log('🔍 Debug - All appointment properties:', Object.keys(appointment));

      // Get prescription for this appointment
      const prescriptions = await apiService.getPrescriptionByAppointment(appointment.appointmentID);
      console.log('🔍 Debug - API Response:', prescriptions);

      if (prescriptions && prescriptions.length > 0) {
        console.log('🔍 Debug - Found prescription:', prescriptions[0]);
        setSelectedPrescription(prescriptions[0]);
        setShowViewModal(true);
      } else {
        console.log('🔍 Debug - No prescriptions found');
        alert('No prescription found for this appointment');
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
      alert('Failed to load prescription details');
    }
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedPrescription(null);
  };

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (userRole === 'patient' && !appointment.doctorName && appointment.doctorID) {
        try {
          const doctor = await apiService.getDoctorById(appointment.doctorID);
          setDoctorName(doctor.name);
        } catch (error) {
          console.error('Error fetching doctor name:', error.message);
        }
      }
    };

    fetchDoctorName();
    updateAppointmentStatusIfExpired(); // 👈 Auto cancel expired if needed
  }, [appointment.doctorID, userRole, appointment.doctorName]);

  return (
    <>
      <Card className="appointment-card h-100">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h6 className="mb-1">
                {userRole === 'patient'
                  ? `Dr. ${appointment.doctorName || doctorName || 'Loading...'}`
                  : `Patient Name: ${appointment.patientName}`}
              </h6>
            </div>
            {/* <Badge bg={getStatusVariant(appointment.status)}>
              {appointment.status}
            </Badge> */}
          </div>

          <div className="mb-3">
            <p className="mb-1">
              <strong>📅 Date:</strong> {formatDate(appointment.date)}
            </p>
            <p className="mb-1">
              <strong>🕐 Time:</strong> {appointment.timeSlot}
            </p>
            <p className="mb-1">
              <strong>📋 Status:</strong>{' '}
              <Badge bg={getStatusVariant(appointment.status)} className="ms-1">
                {appointment.status}
              </Badge>
            </p>
            <p className="mb-0">
              <strong>💳 Payment:</strong>{' '}
              <Badge bg={getPaymentStatusVariant(appointment.paymentStatus)} className="ms-1">
                {appointment.paymentStatus}
              </Badge>
            </p>
          </div>

          <div className="d-grid gap-2">
            {userRole === 'patient' && (
              <>
                {appointment.paymentStatus === 'Unpaid' && (
                  <Button
                    as={Link}
                    to={`/payment/${appointment.appointmentID}`}
                    variant="warning"
                    size="sm"
                  >
                    Complete Payment
                  </Button>
                )}

                {canStartChat() && (
                  <Button
                    as={Link}
                    to={`/chat/${appointment.appointmentID}`}
                    variant="success"
                    size="sm"
                  >
                    Join Consultation
                  </Button>
                )}

                {appointment.status === 'Completed' && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleViewPrescription}
                  >
                    View Prescription
                  </Button>
                )}

                                                             {/* Debug info - remove this later */}
                   {appointment.status === 'Booked' && !canStartChat() && (
                     <div className="text-muted small">
                       <small>
                         💡 Chat available when: {userRole === 'doctor' ? 'Appointment is Booked and within appointment time slot' : 'Payment is Paid and within appointment time slot'}
                       </small>
                     </div>
                   )}
              </>
            )}

            {userRole === 'doctor' && (
              <>
                {canStartChat() && (
                  <Button
                    as={Link}
                    to={`/chat/${appointment.appointmentID}`}
                    variant="primary"
                    size="sm"
                  >
                    Start Consultation
                  </Button>
                )}

                {appointment.status === 'Booked' && userRole === 'doctor' && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={handleCompleteConsultation}
                    className="me-2"
                  >
                    Complete Consultation
                  </Button>
                )}

                {appointment.status === 'Completed' && (
                  <Button
                    as={Link}
                    to={`/create-prescription/${appointment.appointmentID}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Create Prescription
                  </Button>
                )}

                               {appointment.status === 'Completed' && (
                   <Button
                     variant="outline-secondary"
                     size="sm"
                     onClick={handleViewPrescription}
                   >
                     View Prescription
                   </Button>
                 )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* View Prescription Modal */}
      <ViewPrescriptionModal
        show={showViewModal}
        onHide={handleCloseModal}
        prescription={selectedPrescription}
        userRole={userRole}
      />
    </>
  );
};

export default AppointmentCard;
