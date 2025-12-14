import api from './axios';

/**
 * Tasks API Service
 */

// Get all tasks with filters
export const getTasks = async (params = {}) => {
  const { page = 1, limit = 20, sort = 'createdAt', order = 'DESC', projectId, status, priority } = params;
  const response = await api.get('/tasks', {
    params: { page, limit, sort, order, projectId, status, priority },
  });
  return response.data;
};

// Get task by ID
export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

// Create new task
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
};
