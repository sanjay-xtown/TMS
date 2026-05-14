import api from './axios';

export const parentLogin = async (mobileNumber, password) => {
  // Sanitize mobile number (remove spaces, dashes, etc.)
  const cleanMobile = mobileNumber.replace(/\D/g, '');
  const response = await api.post('/parents/login', { mobileNumber: cleanMobile, password });
  const { token, parent } = response.data;
  
  // Store token and parent info
  localStorage.setItem('token', token);
  localStorage.setItem('parent', JSON.stringify(parent));
  
  return { token, parent };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('parent');
};

export const getStoredParent = () => {
  const parent = localStorage.getItem('parent');
  return parent ? JSON.parse(parent) : null;
};
