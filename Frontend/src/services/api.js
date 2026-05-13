import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ── Request interceptor: attach JWT token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: auto-logout on 401 (expired/invalid token) ───────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear all stale auth data and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────
export const authService = {
  login: (data) => api.post('/auth/login', data),
};

// ── SuperAdmin ─────────────────────────────────────────────────────────────
export const superAdminService = {
  login: (data) => api.post('/superadmin/login', data),
  register: (data) => api.post('/superadmin/register', data),
  getProfile: () => api.get('/superadmin/profile'),
};

// ── SchoolAdmin ────────────────────────────────────────────────────────────
export const schoolAdminService = {
  getAll: () => api.get('/schooladmin/all'),
  create: (data) => api.post('/schooladmin/create', data),
  update: (id, data) => api.put(`/schooladmin/update/${id}`, data),
  delete: (id) => api.delete(`/schooladmin/delete/${id}`),
};

// ── Students ───────────────────────────────────────────────────────────────
export const studentService = {
  getAll: () => api.get('/student/all'),
  create: (data) => api.post('/student/create', data),
  remove: (id) => api.delete(`/student/delete/${id}`),
  assignBus: (id, busId) => api.put(`/student/assign-bus/${id}`, { busId }),
};

// ── Buses ──────────────────────────────────────────────────────────────────
export const busService = {
  getAll: () => api.get('/bus/all'),
  create: (data) => api.post('/bus/create', data),
  update: (id, data) => api.put(`/bus/update/${id}`, data),
  remove: (id) => api.delete(`/bus/delete/${id}`),
};

// ── Parents ────────────────────────────────────────────────────────────────
export const parentService = {
  getAll: () => api.get('/parent/all'),
  create: (data) => api.post('/parent/create', data),
  sendInvitation: (parentId) => api.post('/parent/send-invitation', { parentId }),
  remove: (id) => api.delete(`/parent/delete/${id}`),
};

// ── Schools ────────────────────────────────────────────────────────────────
export const schoolService = {
  create: (data) => api.post('/school/create', data),
  getMySchool: () => api.get('/school/my-school'),
};

// ── Settings ───────────────────────────────────────────────────────────────
export const settingsService = {
  getAll: () => api.get('/settings/all'),
  add: (data) => api.post('/settings/add', data),
  update: (id, data) => api.put(`/settings/update/${id}`, data),
  delete: (id) => api.delete(`/settings/delete/${id}`),
};

export default api;
