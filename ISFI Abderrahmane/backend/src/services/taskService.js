const { Task, Project } = require('../models');

class TaskService {
  /**
   * Get all tasks for a project
   */
  async getTasksByProject(projectId, userId, { page = 1, limit = 10, status = null } = {}) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (status) {
      where.status = status;
    }
    if (projectId) {
      where.project_id = projectId;
      // Verify project belongs to user
      const project = await Project.findOne({
        where: { id: projectId, user_id: userId },
      });

      if (!project) {
        const error = new Error('Project not found');
        error.status = 404;
        throw error;
      }
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [{
        model: Project,
        where: { user_id: userId }, // Ensure tasks belong to user's projects
        attributes: ['id', 'name']
      }],
      offset,
      limit: limitNum,
      order: [['priority', 'DESC'], ['due_date', 'ASC']],
    });

    return {
      data: rows.map(this.formatTask),
      pagination: {
        total: count,
        page: pageNum,
        pages: Math.ceil(count / limitNum),
        limit: limitNum,
      },
    };
  }

  /**
   * Get all tasks
   */
  async getAllTasks(userId, filter = {}) {
    const where = {};
    if (filter.status) where.status = filter.status;
    if (filter.priority) where.priority = filter.priority;

    // Optional: filter by project_id if needed in future
    // if (filter.projectId) where.project_id = filter.projectId;

    return await Task.findAll({
      where,
      include: [
        {
          model: Project,
          where: { user_id: userId }, // Ensure user owns the project
          attributes: ['id', 'name'],
        },
      ],
      order: [['due_date', 'ASC']],
    });
  }

  /**
   * Get task by ID
   */
  async getTaskById(taskId, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
        attributes: ['id', 'name'],
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    return this.formatTask(task);
  }

  /**
   * Create new task
   */
  async createTask(userId, {
    projectId,
    title,
    description,
    priority,
    dueDate,
    estimatedHours,
  }) {
    // Verify project belongs to user
    const project = await Project.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }

    const newTask = await Task.create({
      project_id: projectId,
      title,
      description,
      priority: priority || 'medium',
      due_date: dueDate,
      estimated_hours: estimatedHours,
      status: 'todo',
    });

    const task = await Task.findByPk(newTask.id, {
      include: [{
        model: Project,
        attributes: ['id', 'name']
      }],
    });

    return this.formatTask(task);
  }

  /**
   * Update task
   */
  async updateTask(taskId, userId, updates) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    const mappedUpdates = {
      title: updates.title,
      description: updates.description,
      status: updates.status,
      priority: updates.priority,
      due_date: updates.dueDate,
      estimated_hours: updates.estimatedHours,
    };

    Object.keys(mappedUpdates).forEach((key) => {
      if (mappedUpdates[key] !== undefined) {
        task[key] = mappedUpdates[key];
      }
    });

    await task.save();

    return this.formatTask(task);
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId, userId, status) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    task.status = status;
    await task.save();

    return this.formatTask(task);
  }

  /**
   * Delete task
   */
  async deleteTask(taskId, userId) {
    const task = await Task.findByPk(taskId, {
      include: [{
        model: Project,
        where: { user_id: userId },
      }],
    });

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    await task.destroy();

    return { message: 'Task deleted successfully' };
  }

  /**
   * Format task response
   */
  formatTask(task) {
    const projectData = task.Project || task.project;
    return {
      id: task.id,
      projectId: task.project_id,
      title: task.title,
      description: task.description,
      status: task.status === 'done' ? 'completed' : task.status,
      priority: task.priority,
      dueDate: task.due_date,
      estimatedHours: task.estimated_hours,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      project: projectData ? {
        id: projectData.id,
        name: projectData.name
      } : null,
    };
  }
}

module.exports = new TaskService();
