/**
 * Timer Service - Centralized timer logic with localStorage persistence
 * 
 * This service provides a single source of truth for timer state,
 * ensuring the timer persists across navigation, page refresh, and app restarts.
 */

const STORAGE_KEY = 'activeTimer';

/**
 * Timer state structure
 * @typedef {Object} TimerState
 * @property {number} id - Time entry ID from backend
 * @property {number} projectId - Selected project ID
 * @property {string} description - Timer description
 * @property {number} startTimestamp - Timestamp when timer started (Date.now())
 * @property {number|null} pausedAt - Timestamp when paused (null if running)
 * @property {number} pausedDuration - Total seconds paused (for resume calculation)
 */

/**
 * Get active timer from localStorage
 * @returns {TimerState|null}
 */
export const getActiveTimer = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const timer = JSON.parse(saved);
    
    // Validate timer data
    if (!timer.startTimestamp || typeof timer.startTimestamp !== 'number') {
      return null;
    }
    
    // Check if timer is too old (more than 24 hours)
    const ageInHours = (Date.now() - timer.startTimestamp) / (1000 * 60 * 60);
    if (ageInHours > 24) {
      console.warn('Timer is older than 24 hours, clearing...');
      clearActiveTimer();
      return null;
    }
    
    return timer;
  } catch (error) {
    console.error('Error reading timer from localStorage:', error);
    return null;
  }
};

/**
 * Save active timer to localStorage
 * @param {TimerState} timer
 */
export const saveActiveTimer = (timer) => {
  try {
    if (!timer) {
      clearActiveTimer();
      return;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  } catch (error) {
    console.error('Error saving timer to localStorage:', error);
  }
};

/**
 * Clear active timer from localStorage
 */
export const clearActiveTimer = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing timer from localStorage:', error);
  }
};

/**
 * Check if timer is currently running
 * @param {TimerState|null} timer
 * @returns {boolean}
 */
export const isTimerRunning = (timer) => {
  if (!timer || !timer.startTimestamp) return false;
  return timer.pausedAt === null || timer.pausedAt === undefined;
};

/**
 * Calculate elapsed time in seconds
 * @param {TimerState|null} timer
 * @returns {number} Elapsed seconds
 */
export const calculateElapsedTime = (timer) => {
  if (!timer || !timer.startTimestamp) return 0;
  
  const now = Date.now();
  const pausedDuration = timer.pausedDuration || 0;
  
  if (timer.pausedAt) {
    // Timer is paused - calculate up to pause time
    const elapsed = Math.floor((timer.pausedAt - timer.startTimestamp) / 1000);
    return Math.max(0, elapsed - pausedDuration);
  } else {
    // Timer is running - calculate current elapsed time
    const elapsed = Math.floor((now - timer.startTimestamp) / 1000);
    return Math.max(0, elapsed - pausedDuration);
  }
};

/**
 * Format seconds to HH:MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Create a new timer state
 * @param {Object} params
 * @param {number} params.id - Time entry ID
 * @param {number} params.projectId - Project ID
 * @param {string} params.description - Description
 * @returns {TimerState}
 */
export const createTimerState = ({ id, projectId, description }) => {
  return {
    id,
    projectId,
    description: description || '',
    startTimestamp: Date.now(),
    pausedAt: null,
    pausedDuration: 0
  };
};

/**
 * Pause the timer
 * @param {TimerState} timer
 * @returns {TimerState}
 */
export const pauseTimer = (timer) => {
  if (!timer || timer.pausedAt) return timer;
  
  return {
    ...timer,
    pausedAt: Date.now()
  };
};

/**
 * Resume the timer
 * @param {TimerState} timer
 * @returns {TimerState}
 */
export const resumeTimer = (timer) => {
  if (!timer || !timer.pausedAt) return timer;
  
  const pauseDuration = Math.floor((Date.now() - timer.pausedAt) / 1000);
  
  return {
    ...timer,
    pausedAt: null,
    pausedDuration: (timer.pausedDuration || 0) + pauseDuration
  };
};
