// src/services/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Vite proxy will redirect this
});

// Set default header if token exists on init
const token = localStorage.getItem('token');
if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request Interceptor to attach token dynamically
instance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token'); // ✅ get token directly

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token from localStorage:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for 401 handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance;
