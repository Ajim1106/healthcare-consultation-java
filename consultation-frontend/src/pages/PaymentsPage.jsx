import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';
import PaymentForm from '../components/payment/PaymentForm';


const PaymentsPage = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const doctorId = queryParams.get('doctorId');

  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (appointmentId) {
      fetchAppointmentById();
    } else {
      setLoading(false);
    }
  }, [appointmentId, user, navigate]);

  const fetchAppointmentById = async () => {
    try {
      const fetchedAppointment = await apiService.getAppointmentById(appointmentId);
      setAppointment(fetchedAppointment);
    } catch (err) {
      console.error('❌ Error fetching appointment:', err);
      setError(err.message || 'Failed to fetch appointment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      if (!appointment) {
        showToast('⚠️ Appointment not found', 'warning');
        return;
      }

      // Patient info is available through the appointment object
      const payload = {
        AppointmentID: appointment.appointmentID,
        Amount: 500, // Fixed: Changed from 50 to 500 to match frontend display
        EndDate: new Date().toISOString().split("T")[0],
        PaymentMode: 'RazorPay',
        RazorpayOrderId: paymentResponse?.razorpay_order_id || 'order_dummy',
        RazorpayPaymentId: paymentResponse?.razorpay_payment_id || 'pay_dummy',
        RazorpaySignature: paymentResponse?.razorpay_signature || 'signature_dummy'
        // Note: PatientID is not needed - patient info comes from the appointment
      };

      console.log("📤 Sending Payment Payload:", payload);
      await apiService.createPayment(payload);

      await apiService.updatePaymentStatus(appointmentId, "Paid");

      showToast('✅ Payment successful!', 'success');
      navigate('/appointments');
    } catch (err) {
      console.error("❌ Payment recording error:", err.message || err);
      showToast('Payment record failed. Contact support.', 'error');
    }
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!appointmentId || !appointment) {
    return (
      <Container className="my-4">
        <Alert variant="warning">No appointment found for payment.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Complete Payment</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6>Appointment Details</h6>
                <p className="mb-1"><strong>Date:</strong> {new Date(appointment?.date).toLocaleDateString()}</p>
                <p className="mb-1"><strong>Time:</strong> {appointment?.timeSlot}</p>
                <p className="mb-1"><strong>Doctor:</strong> {appointment?.doctorName}</p>
                <p className="mb-1"><strong>Patient:</strong> {appointment?.patientName}</p> {/* ✅ NEW LINE */}
                <p className="mb-0"><strong>Consultation Fee:</strong> ₹500.00</p>
              </div>

              <PaymentForm
                amount={500}
                appointment={appointment}
                onSuccess={handlePaymentSuccess}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentsPage;
