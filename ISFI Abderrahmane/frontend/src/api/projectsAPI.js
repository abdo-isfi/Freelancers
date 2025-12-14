import api from './axios';

/**
 * Projects API Service
 */

// Get all projects with pagination and filters
export const getProjects = async (params = {}) => {
  const { page = 1, limit = 20, sort = 'createdAt', order = 'DESC', clientId } = params;
  const response = await api.get('/projects', {
    params: { page, limit, sort, order, clientId },
  });
  return response.data;
};

// Get project by ID
export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// Create new project
export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

// Update project
export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// Update project status
export const updateProjectStatus = async (id, status) => {
  const response = await api.patch(`/projects/${id}/status`, { status });
  return response.data;
};
