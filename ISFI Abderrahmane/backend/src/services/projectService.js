const { Project, Client } = require('../models');

class ProjectService {
  /**
   * Get all projects for a user
   */
  async getAllProjects(userId, { page = 1, limit = 10, status = null } = {}) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const where = { user_id: userId };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Project.findAndCountAll({
      where,
      include: [{ model: Client, attributes: ['id', 'name'] }],
      offset,
      limit: limitNum,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows.map(this.formatProject),
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    };
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId, userId) {
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
      include: [{ model: Client, attributes: ['id', 'name'] }],
    });

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    return this.formatProject(project);
  }

  /**
   * Create new project
   */
  async createProject(userId, {
    clientId,
    name,
    description,
    billingType,
    hourlyRate,
    dayRate,
    fixedAmount,
    startDate,
    endDateEstimated,
  }) {
    // Verify client belongs to user
    const client = await Client.findOne({
      where: { id: clientId, user_id: userId },
    });

    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }

    const newProject = await Project.create({
      user_id: userId,
      client_id: clientId,
      name,
      description,
      billing_type: billingType,
      hourly_rate: hourlyRate,
      day_rate: dayRate,
      fixed_amount: fixedAmount,
      start_date: startDate,
      end_date_estimated: endDateEstimated,
      status: 'active',
    });

    // Reload with client data
    const project = await Project.findOne({
      where: { id: newProject.id },
      include: [{ model: Client, attributes: ['id', 'name'] }],
    });

    return this.formatProject(project);
  }

  /**
   * Update project
   */
  async updateProject(projectId, userId, updates) {
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    const mappedUpdates = {
      name: updates.name,
      description: updates.description,
      billing_type: updates.billingType,
      hourly_rate: updates.hourlyRate,
      day_rate: updates.dayRate,
      fixed_amount: updates.fixedAmount,
      status: updates.status,
      start_date: updates.startDate,
      end_date_estimated: updates.endDateEstimated,
    };

    Object.keys(mappedUpdates).forEach((key) => {
      if (mappedUpdates[key] !== undefined) {
        project[key] = mappedUpdates[key];
      }
    });

    await project.save();

    return this.formatProject(project);
  }

  /**
   * Delete project
   */
  async deleteProject(projectId, userId) {
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    await project.destroy();

    return { message: 'Project deleted successfully' };
  }

  /**
   * Format project response
   */
  formatProject(project) {
    return {
      id: project.id,
      clientId: project.client_id,
      client: project.Client ? {
        id: project.Client.id,
        name: project.Client.name,
      } : null,
      name: project.name,
      description: project.description,
      billingType: project.billing_type,
      hourlyRate: project.hourly_rate,
      dayRate: project.day_rate,
      fixedAmount: project.fixed_amount,
      status: project.status,
      startDate: project.start_date,
      endDateEstimated: project.end_date_estimated,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}

module.exports = new ProjectService();
