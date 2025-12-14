const projectService = require('../services/projectService');

/**
 * Get all projects
 */
const getProjects = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page, limit, status } = req.query;

    const result = await projectService.getAllProjects(userId, { page, limit, status });

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project by ID
 */
const getProjectById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const project = await projectService.getProjectById(id, userId);

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create project
 */
const createProject = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      clientId,
      name,
      description,
      billingType,
      hourlyRate,
      dayRate,
      fixedAmount,
      startDate,
      endDateEstimated,
    } = req.body;

    const project = await projectService.createProject(userId, {
      clientId,
      name,
      description,
      billingType,
      hourlyRate,
      dayRate,
      fixedAmount,
      startDate,
      endDateEstimated,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 */
const updateProject = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const project = await projectService.updateProject(id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 */
const deleteProject = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await projectService.deleteProject(id, userId);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
