import api from './axios';

/**
 * Invoices API Service
 */

// Get all invoices
export const getInvoices = async (params = {}) => {
  const { page = 1, limit = 20, clientId, status } = params;
  const response = await api.get('/invoices', {
    params: { page, limit, clientId, status },
  });
  return response.data;
};

// Get invoice by ID
export const getInvoice = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

// Create new invoice
export const createInvoice = async (invoiceData) => {
  const response = await api.post('/invoices', invoiceData);
  return response.data;
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  const response = await api.put(`/invoices/${id}`, invoiceData);
  return response.data;
};

// Delete invoice
export const deleteInvoice = async (id) => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};

// Mark invoice as paid
export const markInvoicePaid = async (id) => {
  const response = await api.post(`/invoices/${id}/mark-paid`);
  return response.data;
};

// Download invoice PDF
export const downloadInvoice = async (id) => {
  const response = await api.get(`/invoices/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
};
