import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import apiService from '../../services/apiService';
import '../../assets/styles/custom.css';

const AppointmentForm = ({ doctor: doctorProp }) => {
  const [formData, setFormData] = useState({ date: '', timeSlot: '' });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState(doctorProp || null);
  const [doctorAvailability, setDoctorAvailability] = useState([]);

  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();
  const { id: doctorIdFromURL } = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const id = doctorProp?.doctorID || doctorIdFromURL;
        const fetchedDoctor = await apiService.getDoctorById(id);
        setDoctor(fetchedDoctor);
        setDoctorAvailability(fetchedDoctor.availability || []);
      } catch (err) {
        console.error('Doctor fetch error:', err);
        setError('Failed to load doctor details.');
      }
    };
    fetchDoctor();
  }, [doctorProp, doctorIdFromURL]);

  useEffect(() => {
    if (formData.date && doctor) fetchAvailableSlots();
  }, [formData.date, doctor]);

  const fetchAvailableSlots = async () => {
    try {
      const selectedDay = new Date(formData.date).toLocaleDateString('en-US', {
        weekday: 'long'
      });

      const availability = doctorAvailability.find(
        a =>
          a.day.toLowerCase() === selectedDay.toLowerCase() &&
          (a.status || '').toLowerCase() === 'available'
      );

      if (!availability) {
        setAvailableSlots([]);
        setError(`Doctor is not available on ${selectedDay}`);
        return;
      }

      const slots = generateTimeSlots(availability.from, availability.to);

      const allAppointments = await apiService.getBookedAppointmentsByDoctor(
        doctor.doctorID
      );
      console.log('✅ All appointments:', allAppointments);

      const selectedDateFormatted = new Date(formData.date).toLocaleDateString('en-US');

      const normalize = (val) => val?.trim().toLowerCase();

      const booked = allAppointments
        .filter(app => {
          const appDate = new Date(app.date).toLocaleDateString('en-US');
          return appDate === selectedDateFormatted;
        })
        .map(app => normalize(app.timeSlot));

      console.log('📅 Booked slots for selected date:', booked);

      const filteredSlots = slots.filter(
        slot => !booked.includes(normalize(slot))
      );

      console.log('🟨 Filtered Available Slots:', filteredSlots);

      setBookedSlots(booked);
      setAvailableSlots(filteredSlots);
      setError('');
    } catch (err) {
      console.error('Slot fetch error:', err);
      setError('Failed to load available time slots.');
    }
  };

  const generateTimeSlots = (from, to) => {
    const slots = [];
    // Handle both "12:00" and "12:00:00" formats
    const parseTime = (t) => {
      const parts = t.split(':').map(Number);
      return { hour: parts[0], min: parts[1] || 0 };
    };

    const { hour: startHour, min: startMin } = parseTime(from);
    const { hour: endHour,   min: endMin   } = parseTime(to);

    const selectedDate = new Date(formData.date);
    const today        = new Date();
    const isToday      = selectedDate.toDateString() === today.toDateString();

    const startTime = new Date(selectedDate);
    startTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date(selectedDate);
    endTime.setHours(endHour, endMin, 0, 0);

    if (isToday) {
      const currentTime = new Date();
      while (startTime < endTime) {
        const slotEnd = new Date(startTime.getTime() + 60 * 60000);
        if (currentTime >= slotEnd) {
          startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
        } else {
          break;
        }
      }
    }

    while (startTime < endTime) {
      const slotStart = new Date(startTime);
      const slotEnd   = new Date(startTime.getTime() + 60 * 60000);
      if (slotEnd > endTime) break;
      slots.push(`${formatTime(slotStart)} - ${formatTime(slotEnd)}`);
      startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
    }

    return slots;
  };


  const formatTime = date => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.date || !formData.timeSlot) {
      setError('Please select a valid date and time slot.');
      setLoading(false);
      return;
    }

    const selectedDay = new Date(formData.date).toLocaleDateString('en-US', {
      weekday: 'long'
    });
    const isAvailable = doctorAvailability.some(
      a =>
        a.day.toLowerCase() === selectedDay.toLowerCase() &&
        (a.status || '').toLowerCase() === 'available'
    );

    if (!isAvailable) {
      setError(`Doctor is not available on ${selectedDay}`);
      setLoading(false);
      return;
    }

    if (bookedSlots.includes(formData.timeSlot.trim().toLowerCase())) {
      setError('Selected slot already booked. Choose another.');
      setLoading(false);
      return;
    }

    const newAppointment = {
      doctorID: doctor.doctorID,
      patientID: user.patientID,
      date: formData.date,
      timeSlot: formData.timeSlot,
      status: 'Booked',
      paymentStatus: 'Unpaid'
    };

    try {
      const created = await apiService.createAppointment(newAppointment);
      showToast('Redirecting to payment...', 'info');
      navigate(`/payment/${created.appointmentID}?doctorId=${doctor.doctorID}`);
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Something went wrong.', 'danger');
      setError('Could not create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];
  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              max={getMaxDate()}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {formData.date && (
        <Form.Group className="mb-4">
          <Form.Label>Available Time Slots</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {availableSlots.map(slot => (
              <div
                key={slot}
                className={`availability-slot ${formData.timeSlot === slot ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, timeSlot: slot })}
              >
                {slot}
              </div>
            ))}
          </div>
          {availableSlots.length === 0 && (
            <p className="text-muted mt-2">
              No available slots for this date.
            </p>
          )}
        </Form.Group>
      )}

      <Alert variant="info">
        <strong>Consultation Fee:</strong> ₹500
      </Alert>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading || !formData.date || !formData.timeSlot}
        className="w-100"
      >
        {loading ? 'Booking...' : 'Proceed to Payment'}
      </Button>
    </Form>
  );
};

export default AppointmentForm;
