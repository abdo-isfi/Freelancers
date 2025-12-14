import api from './axios';

/**
 * Authentication API Service
 */

// Register new user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  // Store tokens in localStorage (auto-login after registration)
  if (response.data.success && response.data.data) {
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  // Store tokens in localStorage
  if (response.data.success && response.data.data) {
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  return response.data;
};

// Refresh access token
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await api.post('/auth/refresh', { refreshToken });
  
  if (response.data.success && response.data.data) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
  }
  
  return response.data;
};

// Logout user
export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  try {
    await api.post('/auth/logout', { refreshToken });
  } finally {
    // Clear tokens regardless of API call success
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Get current user
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Helper: Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Helper: Get access token
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};
