import api from './axios';

/**
 * Dashboard API Service
 */

// Get dashboard summary stats
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};
