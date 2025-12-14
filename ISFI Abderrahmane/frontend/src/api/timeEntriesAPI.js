import api from './axios';

/**
 * Time Entries API Service
 */

// Get all time entries
export const getTimeEntries = async (params = {}) => {
  const { page = 1, limit = 20, projectId, taskId, startDate, endDate } = params;
  const response = await api.get('/time-entries', {
    params: { page, limit, projectId, taskId, startDate, endDate },
  });
  return response.data;
};

// Get time entry by ID
export const getTimeEntry = async (id) => {
  const response = await api.get(`/time-entries/${id}`);
  return response.data;
};

// Create new time entry
export const createTimeEntry = async (entryData) => {
  const response = await api.post('/time-entries', entryData);
  return response.data;
};

// Start timer
export const startTimer = async (timerData) => {
  const response = await api.post('/time-entries/start', timerData);
  return response.data;
};

// Stop timer
export const stopTimer = async (id) => {
  const response = await api.post(`/time-entries/${id}/stop`);
  return response.data;
};

// Update time entry
export const updateTimeEntry = async (id, entryData) => {
  const response = await api.put(`/time-entries/${id}`, entryData);
  return response.data;
};

// Delete time entry
export const deleteTimeEntry = async (id) => {
  const response = await api.delete(`/time-entries/${id}`);
  return response.data;
};
