import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Admin Service Structure
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const schoolService = {
  getSchools: () => api.get('/schools'),
  createSchool: (data) => api.post('/schools', data),
  updateSchool: (id, data) => api.put(`/schools/${id}`, data),
  deleteSchool: (id) => api.delete(`/schools/${id}`),
};

export const studentService = {
  getStudents: () => api.get('/students'),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

export const busService = {
  getBuses: () => api.get('/bus'),
  updateBus: (id, data) => api.put(`/bus/${id}`, data),
};

export const trackingService = {
  getLiveLocation: (busId) => api.get(`/tracking/live-location/${busId}`),
};
