const clientService = require('../services/clientService');

/**
 * Get all clients
 */
const getClients = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page, limit } = req.query;

    const result = await clientService.getAllClients(userId, { page, limit });

    res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get client by ID
 */
const getClientById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const client = await clientService.getClientById(id, userId);

    res.status(200).json({
      success: true,
      message: 'Client retrieved successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create client
 */
const createClient = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, email, phone, company, address, website } = req.body;

    const client = await clientService.createClient(userId, {
      name,
      email,
      phone,
      company,
      address,
      website,
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update client
 */
const updateClient = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const client = await clientService.updateClient(id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete client
 */
const deleteClient = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await clientService.deleteClient(id, userId);

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
