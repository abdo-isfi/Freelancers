import api from './axios';

/**
 * Clients API Service
 */

// Get all clients with pagination
export const getClients = async (params = {}) => {
  const { page = 1, limit = 20, sort = 'createdAt', order = 'DESC' } = params;
  const response = await api.get('/clients', {
    params: { page, limit, sort, order },
  });
  return response.data;
};

// Get client by ID
export const getClient = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

// Create new client
export const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

// Update client
export const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

// Delete client
export const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};
