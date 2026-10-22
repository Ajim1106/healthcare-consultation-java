import axiosInstance from './axiosInstance';

class ApiService {
  // ================= Appointments =================

  async getAppointments(patientId = null, doctorId = null) {
    try {
      if (doctorId) {
        const res = await axiosInstance.get(`/doctor/appointments/${doctorId}`);
        return res.data;
      }
      if (patientId) {
        const res = await axiosInstance.get(`/patient/appointments/${patientId}`);
        return res.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  async getAppointmentById(appointmentId) {
  try {
    const response = await axiosInstance.get(`/appointment/${appointmentId}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.response?.data || 'Failed to fetch appointment by ID';
    console.error('❌ Error in getAppointmentById:', message);
    throw new Error(message);
  }
}



  async createAppointment(appointmentData) {
    try {
      const {
        doctorID,
        patientID,
        date,
        timeSlot,
        status = 'Booked',
        paymentStatus = 'Unpaid'
      } = appointmentData;

      const payload = {
        appointmentID: 0,
        doctorID,
        patientID,
        date,
        timeSlot,
        status,
        paymentStatus
      };

      const res = await axiosInstance.post('/appointment', payload);
      return res.data;
    } catch (error) {
      console.error('Error creating appointment:', error.response?.data || error.message);
      throw error;
    }
  }

  async updatePaymentStatus(appointmentId, status) {
  try {
    const response = await axiosInstance.patch(
      `/appointment/${appointmentId}/payment-status`,
      JSON.stringify(status), // send as raw string
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data || 'Failed to update payment status'
    );
  }
}

//=============================Appointments=============================
// ✅ Fetch appointments by patient
async getAppointmentsByPatient(patientId) {
  try {
    const response = await axiosInstance.get(`/appointment/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data || 'Failed to fetch appointments for patient'
    );
  }
}

// ✅ Fetch appointments by doctor
async getAppointmentsByDoctor(doctorId) {
  try {
    const response = await axiosInstance.get(`/appointment/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data || 'Failed to fetch appointments for doctor'
    );
  }
}


  async getAppointmentBySlot(patientId, doctorId, date, timeSlot) {
    try {
      const trimmedTimeSlot = timeSlot?.trim();

      const response = await axiosInstance.get('/appointment/by-slot', {
        params: {
          patientId,
          doctorId,
          date,
          timeSlot: trimmedTimeSlot
        }
      });

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data || error.message || 'Unknown error';
      console.error('❌ Error fetching appointment by slot:', errorMsg);
      throw new Error(
        typeof errorMsg === 'string'
          ? errorMsg
          : JSON.stringify(errorMsg)
      );
    }
  }

  // Update appointment status (e.g., to "Cancelled", "Completed", etc.)
async updateAppointmentStatus(appointmentId, status) {
  try {
    const response = await axiosInstance.patch(`/appointment/${appointmentId}/status`, status, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data || error.message || 'Unknown error';
    console.error('❌ Error updating appointment status:', errorMsg);
    throw new Error(
      typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)
    );
  }
}

async getAppointmentsWithDoctorName(patientId) {
    try {
      const res = await axiosInstance.get(`/appointment/patientDocterName/${patientId}`);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch appointments with doctor name:', error);
      throw error;
    }
  }


   async getBookedAppointmentsByDoctor(doctorId) {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn("⚠️ No token found — user may not be authenticated");
      return [];
    }

    const res = await axiosInstance.get(`/appointment/doctor/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!Array.isArray(res.data)) {
      console.warn('⚠️ Unexpected data format:', res.data);
      return [];
    }

    return res.data.filter(appointment => appointment.status === 'Booked');
  } catch (error) {
    console.error("❌ Error fetching doctor's appointments:", error.response?.data || error.message);
    return [];
  }
}

  // ================= Doctors =================

  async getDoctors(filters = {}) {
    try {
      const response = await axiosInstance.get('/doctor/getAllDoctors');
      let doctors = response.data;

      if (filters.name) {
        doctors = doctors.filter((doc) =>
          (doc.name || doc.Name)?.toLowerCase().includes(filters.name.toLowerCase())
        );
      }

      if (filters.specialization) {
        doctors = doctors.filter((doc) =>
          (doc.specialization || doc.Specialization)?.toLowerCase().includes(filters.specialization.toLowerCase())
        );
      }

      return doctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  }

  async getDoctorById(doctorId) {
    try {
      const res = await axiosInstance.get(`/doctor/getDoctorById/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Doctor not found:', error);
      throw error;
    }
  }

  async getDoctorAvailability(doctorId) {
    try {
      const res = await axiosInstance.get(`/availability/doctor/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  }

  async updateDoctorAvailability(doctorId, availabilityData) {
    try {
      const res = await axiosInstance.put(`/doctor/availability/${doctorId}`, availabilityData);
      return res.data;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  }
  //==================Availability======================

  async getDoctorAvailability(doctorId) {
    try {
      const res = await axiosInstance.get(`/doctor/getAvailability/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch doctor availability:', error);
      throw error;
    }
  }

 async updateDoctorAvailability(doctorId, availabilityList) {
  try {
    const res = await axiosInstance.put(
      `/doctor/updateAvailability/${doctorId}`,
      availabilityList
    );
    return res.data; // { message: "Availability updated successfully." }
  } catch (error) {
    console.error('Failed to update doctor availability:', error?.response?.data || error.message);
    throw error;
  }
}


  // ================= Messages =================

  async getMessages(appointmentId) {
    try {
      const res = await axiosInstance.get(`/message/${appointmentId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(messageData) {
    try {
      const res = await axiosInstance.post('/message', messageData);
      return res.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // ================= Prescriptions =================

  async getPrescriptions(patientId = null, doctorId = null) {
    try {
      let res;
      if (doctorId) {
        res = await axiosInstance.get(`/prescription/doctor/${doctorId}`);
      } else if (patientId) {
        res = await axiosInstance.get(`/prescription/patient/${patientId}`);
      } else {
        return [];
      }

      // Process the prescription data to ensure names are available
      const prescriptions = res.data;
      return prescriptions.map(prescription => this.processPrescriptionData(prescription));
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return [];
    }
  }

  async createPrescription(prescriptionData) {
    try {
      const res = await axiosInstance.post('/prescription', prescriptionData);
      return res.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  }

  async getPrescriptionByAppointment(appointmentId) {
    try {
      console.log('🔍 API Debug - Fetching prescription for appointment ID:', appointmentId);
      const res = await axiosInstance.get(`/prescription/appointment/${appointmentId}`);
      console.log('🔍 API Debug - Raw Response:', res.data);
      console.log('🔍 API Debug - Response type:', typeof res.data);
      console.log('🔍 API Debug - Is Array:', Array.isArray(res.data));

      if (Array.isArray(res.data)) {
        console.log('🔍 API Debug - Processing array of prescriptions');
        const processed = res.data.map(prescription => this.processPrescriptionData(prescription));
        console.log('🔍 API Debug - Processed prescriptions:', processed);
        return processed;
      } else {
        console.log('🔍 API Debug - Processing single prescription');
        const processed = this.processPrescriptionData(res.data);
        console.log('🔍 API Debug - Processed prescription:', processed);
        return processed;
      }
    } catch (error) {
      console.error('Error fetching prescription by appointment:', error);
      throw error;
    }
  }

  async getPrescriptionById(prescriptionId) {
    try {
      const res = await axiosInstance.get(`/prescription/${prescriptionId}`);

      // Process the prescription data to ensure names are available
      return this.processPrescriptionData(res.data);
    } catch (error) {
      console.error('Error fetching prescription by ID:', error);
      throw error;
    }
  }

  // ================= Payments =================

  async getPayments(patientId = null) {
    try {
      const res = await axiosInstance.get(`/payment/patient/${patientId}`);
      const payments = res.data;

      // Enrich payment data with patient information from appointments
      const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
          try {
            // Get appointment details to derive patient information
            const appointment = await this.getAppointmentById(payment.AppointmentID);
            return {
              ...payment,
              patientName: appointment?.patientName || `Patient #${appointment?.patientID}`,
              doctorName: appointment?.doctorName || `Dr. #${appointment?.doctorID}`,
              appointmentDate: appointment?.date,
              appointmentTime: appointment?.timeSlot
            };
          } catch (error) {
            console.error('Error enriching payment data:', error);
            return payment;
          }
        })
      );

      return enrichedPayments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  async getAllPayments() {
    try {
      const res = await axiosInstance.get('/payment');
      const payments = res.data;

      // Enrich payment data with patient information from appointments
      const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
          try {
            // Get appointment details to derive patient information
            const appointment = await this.getAppointmentById(payment.AppointmentID);
            return {
              ...payment,
              patientName: appointment?.patientName || `Patient #${appointment?.patientID}`,
              doctorName: appointment?.doctorName || `Dr. #${appointment?.doctorID}`,
              appointmentDate: appointment?.date,
              appointmentTime: appointment?.timeSlot
            };
          } catch (error) {
            console.error('Error enriching payment data:', error);
            return payment;
          }
        })
      );

      return enrichedPayments;
    } catch (error) {
      console.error('Error fetching all payments:', error);
      return [];
    }
  }

  async getPaymentById(paymentId) {
    try {
      const res = await axiosInstance.get(`/payment/${paymentId}`);
      const payment = res.data;

      // Enrich payment data with patient information from appointment
      try {
        const appointment = await this.getAppointmentById(payment.AppointmentID);
        return {
          ...payment,
          patientName: appointment?.patientName || `Patient #${appointment?.patientID}`,
          doctorName: appointment?.doctorName || `Dr. #${appointment?.doctorID}`,
          appointmentDate: appointment?.date,
          appointmentTime: appointment?.timeSlot
        };
      } catch (error) {
        console.error('Error enriching payment data:', error);
        return payment;
      }
    } catch (error) {
      console.error('Error fetching payment by ID:', error);
      throw error;
    }
  }

  // Inside services/apiService.js

async createPayment(paymentData) {
  try {
    const response = await axiosInstance.post('/payments/create', paymentData); // ✅ Fixed path
    return response.data;
  } catch (error) {
    console.error("❌ Payment creation failed:", error.response?.data || error.message);
    throw new Error(error.response?.data || 'Invalid payment data.');
  }
}




  // ================= Admin =================

  async getDashboardStats() {
    try {
      const res = await axiosInstance.get('/admin/dashboard-stats');
      return res.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {};
    }
  }

  async getPendingDoctors() {
    try {
      const res = await axiosInstance.get('/admin/pending-doctors');
      return res.data;
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
      return [];
    }
  }

  async approveDoctor(doctorId) {
    try {
      const res = await axiosInstance.put(`/admin/approve-doctor/${doctorId}`);
      return res.data;
    } catch (error) {
      console.error('Error approving doctor:', error);
      throw error;
    }
  }

  // ================= Patients =================



async checkPatientEmailExists(email) {
    try {
      const token = localStorage.getItem('token');

      const res = await axiosInstance.get(`/patient/check-email`, {
        params: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.exists === true;
    } catch (error) {
      console.error('❌ Error checking patient email existence:', error.response?.data || error.message);
      return false;
    }
  }

  async checkDoctorEmailExists(email) {
  try {
    const token = localStorage.getItem('token');

    const res = await axiosInstance.get(`/doctor/check-email`, {
      params: { email },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.exists === true;
  } catch (error) {
    console.error('❌ Error checking doctor email existence:', error.response?.data || error.message);
    return false;
  }
}

  // ================= Helper Methods for Names =================

  async getDoctorNameById(doctorId) {
    try {
      const doctor = await this.getDoctorById(doctorId);
      return doctor?.name || doctor?.Name || `Dr. #${doctorId}`;
    } catch (error) {
      console.error('Error fetching doctor name:', error);
      return `Dr. #${doctorId}`;
    }
  }

  async getPatientNameById(patientId) {
    try {
      // Try to get patient name from the context if available
      // For now, we'll return a placeholder since we don't have a direct getPatientById method
      return `Patient #${patientId}`;
    } catch (error) {
      console.error('Error fetching patient name:', error);
      return `Patient #${patientId}`;
    }
  }

  // Cache for doctor and patient names to avoid repeated API calls
  _doctorNameCache = new Map();
  _patientNameCache = new Map();

  async getCachedDoctorName(doctorId) {
    if (this._doctorNameCache.has(doctorId)) {
      return this._doctorNameCache.get(doctorId);
    }

    const name = await this.getDoctorNameById(doctorId);
    this._doctorNameCache.set(doctorId, name);
    return name;
  }

  async getCachedPatientName(patientId) {
    if (this._patientNameCache.has(patientId)) {
      return this._patientNameCache.get(patientId);
    }

    const name = await this.getPatientNameById(patientId);
    this._patientNameCache.set(patientId, name);
    return name;
  }

  // Process prescription data to ensure names are available
  processPrescriptionData(prescription) {
    console.log('🔍 Processing prescription data:', prescription);

    // Extract doctor name from various possible sources
    const doctorName = prescription.doctorName ||
                      prescription.DoctorName ||
                      prescription.Doctor?.name ||
                      prescription.Doctor?.Name ||
                      prescription.doctor?.name ||
                      prescription.doctor?.Name ||
                      (prescription.Doctor && typeof prescription.Doctor === 'object' ? prescription.Doctor.Name : null) ||
                      (prescription.doctor && typeof prescription.doctor === 'object' ? prescription.doctor.name : null) ||
                      `Dr. #${prescription.doctorID || prescription.DoctorID}`;

    // Extract patient name from various possible sources
    const patientName = prescription.patientName ||
                       prescription.PatientName ||
                       prescription.Patient?.name ||
                       prescription.Patient?.Name ||
                       prescription.patient?.name ||
                       prescription.patient?.Name ||
                       (prescription.Patient && typeof prescription.Patient === 'object' ? prescription.Patient.Name : null) ||
                       (prescription.patient && typeof prescription.patient === 'object' ? prescription.patient.name : null) ||
                       `Patient #${prescription.patientID || prescription.PatientID}`;

    console.log('🔍 Extracted doctor name:', doctorName);
    console.log('🔍 Extracted patient name:', patientName);

    // Return processed prescription with guaranteed name properties
    return {
      ...prescription,
      doctorName,
      patientName,
      // Also add the processed names in the expected format
      DoctorName: doctorName,
      PatientName: patientName
    };
  }

}

export default new ApiService();
