// src/services/service.js
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('authToken');
        // You might want to trigger a logout action here
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Example API services
const services = {
  // Authentication
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // Data fetching
  getData: () => apiClient.get('/data'),
  getDataById: (id) => apiClient.get(`/data/${id}`),
  
  // Data posting
  createData: (data) => apiClient.post('/data', data),
  updateData: (id, data) => apiClient.put(`/data/${id}`, data),
  deleteData: (id) => apiClient.delete(`/data/${id}`),
  
  // Add more API services as needed...
};

export default services;