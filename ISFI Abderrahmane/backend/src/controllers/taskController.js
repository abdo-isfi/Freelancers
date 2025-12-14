const taskService = require('../services/taskService');

/**
 * Get all tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { projectId, page, limit, status } = req.query;

    // Project ID is optional now
    // if (!projectId) {
    //   const error = new Error('Project ID is required');
    //   error.status = 400;
    //   throw error;
    // }

    const result = await taskService.getTasksByProject(projectId, userId, { page, limit, status });

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get task by ID
 */
const getTaskById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page, limit, status, priority } = req.query;

    const result = await taskService.getAllTasks(userId, { 
      page, 
      limit,
      status, 
      priority 
    });

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create task
 */
const createTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      projectId,
      title,
      description,
      priority,
      dueDate,
      estimatedHours,
    } = req.body;

    const task = await taskService.createTask(userId, {
      projectId,
      title,
      description,
      priority,
      dueDate,
      estimatedHours,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update task
 */
const updateTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const task = await taskService.updateTask(id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update task status
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status } = req.body;

    const task = await taskService.updateTaskStatus(id, userId, status);

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 */
const deleteTask = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await taskService.deleteTask(id, userId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
