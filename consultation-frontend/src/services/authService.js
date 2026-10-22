// src/services/authService.js
import axios from './axiosInstance';

const TOKEN_KEY = 'token';
const USER_KEY = 'currentUser';

// LOGIN
const login = async (email, password, role) => {
  const response = await axios.post('/login', { email, password, role });

  const { token, user } = response.data;

  // Store token and user with role info
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, role }));

  // Set default auth header
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return { ...user, role };
};

// LOGOUT
const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

// GET CURRENT USER (supports Doctor, Patient, Admin)
const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  const token = localStorage.getItem(TOKEN_KEY);

  if (!userStr || !token) return null;

  const user = JSON.parse(userStr);
  const role = user.role;

  // Normalize IDs based on role
  let normalizedUser = { ...user };

  if (role === 'Doctor') {
    normalizedUser.DoctorID = user?.doctor?.doctorId || user?.DoctorID || user?.doctorId;
  } else if (role === 'Patient') {
    normalizedUser.PatientID = user?.patientId || user?.PatientID;
  } else if (role === 'Admin') {
    normalizedUser.AdminID = user?.adminId || user?.AdminID;
  }

  return {
    ...normalizedUser,
    token,
    role,
  };
};

// REGISTER FUNCTIONS
const registerPatient = async (userData) => {
  const response = await axios.post('/register/patient', userData);
  return response.data;
};

const registerDoctor = async (userData) => {
  const response = await axios.post('/register/doctor', userData);
  return response.data;
};

const registerAdmin = async (userData) => {
  const response = await axios.post('/register/admin', userData);
  return response.data;
};

// EXPORT
export default {
  login,
  logout,
  getCurrentUser,
  registerPatient,
  registerDoctor,
  registerAdmin,
};
