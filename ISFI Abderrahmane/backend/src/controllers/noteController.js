const noteService = require('../services/noteService');

/**
 * Get all notes
 */
const getNotes = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page, limit, projectId } = req.query;

    const result = await noteService.getNotes(userId, { page, limit, projectId });

    res.status(200).json({
      success: true,
      message: 'Notes retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get note by ID
 */
const getNoteById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const note = await noteService.getNoteById(id, userId);

    res.status(200).json({
      success: true,
      message: 'Note retrieved successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create note
 */
const createNote = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      title,
      content,
      projectId,
      clientId,
      taskId,
      color,
    } = req.body;

    const note = await noteService.createNote(userId, {
      title,
      content,
      projectId,
      clientId,
      taskId,
      color,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update note
 */
const updateNote = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    const note = await noteService.updateNote(id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete note
 */
const deleteNote = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    await noteService.deleteNote(id, userId);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
