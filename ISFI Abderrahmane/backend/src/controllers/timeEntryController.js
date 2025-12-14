const timeEntryService = require('../services/timeEntryService');

/**
 * Get all time entries
 */
const getTimeEntries = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page, limit, projectId } = req.query;

    const result = await timeEntryService.getTimeEntries(userId, { page, limit, projectId });

    res.status(200).json({
      success: true,
      message: 'Time entries retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create time entry
 */
const createTimeEntry = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      projectId,
      taskId,
      date,
      startTime,
      endTime,
      description,
      isBillable,
    } = req.body;

    const entry = await timeEntryService.createTimeEntry(userId, {
      projectId,
      taskId,
      date,
      startTime,
      endTime,
      description,
      isBillable,
    });

    res.status(201).json({
      success: true,
      message: 'Time entry created successfully',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update time entry
 */
const updateTimeEntry = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const entry = await timeEntryService.updateTimeEntry(id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Time entry updated successfully',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete time entry
 */
const deleteTimeEntry = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await timeEntryService.deleteTimeEntry(id, userId);

    res.status(200).json({
      success: true,
      message: 'Time entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start time tracking
 */
const startTimeEntry = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { projectId, taskId, description } = req.body;

    const entry = await timeEntryService.startTracking(userId, {
      projectId,
      taskId,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Time tracking started',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Stop time tracking
 */
const stopTimeEntry = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const entry = await timeEntryService.stopTracking(id, userId);

    res.status(200).json({
      success: true,
      message: 'Time tracking stopped',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTimeEntries,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  startTimeEntry,
  stopTimeEntry,
};
