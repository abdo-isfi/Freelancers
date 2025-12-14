import api from './axios';

/**
 * Notes API Service
 */

// Get all notes
export const getNotes = async (params = {}) => {
  const { page = 1, limit = 20, clientId, projectId, taskId } = params;
  const response = await api.get('/notes', {
    params: { page, limit, clientId, projectId, taskId },
  });
  return response.data;
};

// Get note by ID
export const getNote = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

// Create new note
export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

// Update note
export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

// Delete note
export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};
