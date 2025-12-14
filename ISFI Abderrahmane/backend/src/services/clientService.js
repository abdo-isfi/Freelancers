const { Client } = require('../models');

class ClientService {
  /**
   * Get all clients for a user with pagination
   */
  async getAllClients(userId, { page = 1, limit = 10, search = '' } = {}) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await Client.findAndCountAll({
      where: { user_id: userId },
      offset,
      limit: limitNum,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows.map(this.formatClient),
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    };
  }

  /**
   * Get client by ID
   */
  async getClientById(clientId, userId) {
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    return this.formatClient(client);
  }

  /**
   * Create new client
   */
  async createClient(userId, {
    name,
    email,
    phone,
    company,
    address,
    website,
    taxId,
    currency,
  }) {
    const client = await Client.create({
      user_id: userId,
      name,
      contact_email: email,
      contact_phone: phone,
      contact_name: company,
      billing_address: address,
      notes: website ? `Website: ${website}` : null,
      is_archived: false,
    }); 

    return this.formatClient(client);
  }

  /**
   * Update client
   */
  async updateClient(clientId, userId, updates) {
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    const mappedUpdates = {
      name: updates.name,
      contact_email: updates.email,
      contact_phone: updates.phone,
      contact_name: updates.company,
      billing_address: updates.address,
      // Handle website update logic if needed, for now appending or replacing in notes is complex without parsing
      // notes: updates.website ? `Website: ${updates.website}` : client.notes, 
      is_archived: updates.isActive !== undefined ? !updates.isActive : client.is_archived,
    };

    if (updates.website) {
       mappedUpdates.notes = `Website: ${updates.website}`;
    }

    Object.keys(mappedUpdates).forEach((key) => {
      if (mappedUpdates[key] !== undefined) {
        client[key] = mappedUpdates[key];
      }
    });

    await client.save();

    return this.formatClient(client);
  }

  /**
   * Delete client
   */
  async deleteClient(clientId, userId) {
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    await client.destroy();

    return { message: 'Client deleted successfully' };
  }

  /**
   * Format client response
   */
  formatClient(client) {
    let website = null;
    if (client.notes && client.notes.startsWith('Website: ')) {
        website = client.notes.replace('Website: ', '');
    }

    return {
      id: client.id,
      name: client.name,
      email: client.contact_email,
      phone: client.contact_phone,
      company: client.contact_name,
      address: client.billing_address,
      isActive: !client.is_archived,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      website,
    };
  }
}

module.exports = new ClientService();
