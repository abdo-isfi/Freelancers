const { Note } = require('../models');

class NoteService {
  /**
   * Get all notes for a user
   */
  async getNotes(userId, { page = 1, limit = 10, projectId = null } = {}) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const where = { user_id: userId };

    if (projectId) {
      where.project_id = projectId;
    }

    const { count, rows } = await Note.findAndCountAll({
      where,
      offset,
      limit: limitNum,
      order: [['is_pinned', 'DESC'], ['created_at', 'DESC']],
    });

    return {
      data: rows.map(this.formatNote),
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit),
      },
    };
  }

  /**
   * Get note by ID
   */
  async getNoteById(noteId, userId) {
    const note = await Note.findOne({
      where: { id: noteId, user_id: userId },
    });

    if (!note) {
      const error = new Error('Note not found');
      error.status = 404;
      throw error;
    }

    return this.formatNote(note);
  }

  /**
   * Create new note
   */
  async createNote(userId, {
    title,
    content,
    projectId,
    clientId,
    taskId,
    color,
  }) {
    const note = await Note.create({
      user_id: userId,
      project_id: projectId,
      client_id: clientId,
      task_id: taskId,
      title,
      content,
      color: color || 'yellow',
      is_pinned: false,
    });

    return this.formatNote(note);
  }

  /**
   * Update note
   */
  async updateNote(noteId, userId, updates) {
    const note = await Note.findOne({
      where: { id: noteId, user_id: userId },
    });

    if (!note) {
      const error = new Error('Note not found');
      error.status = 404;
      throw error;
    }

    const mappedUpdates = {
      title: updates.title,
      content: updates.content,
      color: updates.color,
      is_pinned: updates.isPinned,
    };

    Object.keys(mappedUpdates).forEach((key) => {
      if (mappedUpdates[key] !== undefined) {
        note[key] = mappedUpdates[key];
      }
    });

    await note.save();

    return this.formatNote(note);
  }

  /**
   * Delete note
   */
  async deleteNote(noteId, userId) {
    const note = await Note.findOne({
      where: { id: noteId, user_id: userId },
    });

    if (!note) {
      const error = new Error('Note not found');
      error.status = 404;
      throw error;
    }

    await note.destroy();

    return { message: 'Note deleted successfully' };
  }

  /**
   * Format note response
   */
  formatNote(note) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      projectId: note.project_id,
      clientId: note.client_id,
      taskId: note.task_id,
      color: note.color,
      isPinned: note.is_pinned,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }
}

module.exports = new NoteService();
