const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const duration = require('dayjs/plugin/duration');
const relativeTime = require('dayjs/plugin/relativeTime');

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Date utility functions using Day.js
 */

/**
 * Get current date/time
 * @returns {Object} Day.js object
 */
const now = () => dayjs();

/**
 * Parse a date string or Date object
 * @param {string|Date} date - Date to parse
 * @returns {Object} Day.js object
 */
const parse = (date) => dayjs(date);

/**
 * Format a date
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Formatted date string
 */
const format = (date, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(formatStr);
};

/**
 * Format date to ISO string
 * @param {string|Date} date - Date to format
 * @returns {string} ISO formatted date string
 */
const toISO = (date) => dayjs(date).toISOString();

/**
 * Add time to a date
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit (years, months, days, hours, minutes, seconds)
 * @returns {Object} Day.js object
 */
const add = (date, amount, unit) => {
  return dayjs(date).add(amount, unit);
};

/**
 * Subtract time from a date
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Unit (years, months, days, hours, minutes, seconds)
 * @returns {Object} Day.js object
 */
const subtract = (date, amount, unit) => {
  return dayjs(date).subtract(amount, unit);
};

/**
 * Calculate difference between two dates
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @param {string} unit - Unit to return (default: 'milliseconds')
 * @returns {number} Difference in specified unit
 */
const diff = (date1, date2, unit = 'milliseconds') => {
  return dayjs(date1).diff(dayjs(date2), unit);
};

/**
 * Check if a date is before another
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean}
 */
const isBefore = (date1, date2) => {
  return dayjs(date1).isBefore(dayjs(date2));
};

/**
 * Check if a date is after another
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean}
 */
const isAfter = (date1, date2) => {
  return dayjs(date1).isAfter(dayjs(date2));
};

/**
 * Check if a date is the same as another
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @param {string} unit - Unit to compare (default: 'millisecond')
 * @returns {boolean}
 */
const isSame = (date1, date2, unit = 'millisecond') => {
  return dayjs(date1).isSame(dayjs(date2), unit);
};

/**
 * Get start of a time unit
 * @param {string|Date} date - Date
 * @param {string} unit - Unit (year, month, day, hour, minute, second)
 * @returns {Object} Day.js object
 */
const startOf = (date, unit) => {
  return dayjs(date).startOf(unit);
};

/**
 * Get end of a time unit
 * @param {string|Date} date - Date
 * @param {string} unit - Unit (year, month, day, hour, minute, second)
 * @returns {Object} Day.js object
 */
const endOf = (date, unit) => {
  return dayjs(date).endOf(unit);
};

/**
 * Calculate duration between two dates in hours
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {number} Duration in hours (rounded to 2 decimals)
 */
const calculateHours = (startTime, endTime) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const minutes = end.diff(start, 'minutes');
  return Math.round((minutes / 60) * 100) / 100; // Round to 2 decimals
};

/**
 * Calculate duration between two dates in milliseconds
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {number} Duration in milliseconds
 */
const calculateDuration = (startTime, endTime) => {
  return dayjs(endTime).diff(dayjs(startTime));
};

/**
 * Format duration in human-readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Human-readable duration (e.g., "2 hours 30 minutes")
 */
const formatDuration = (milliseconds) => {
  const duration = dayjs.duration(milliseconds);
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

/**
 * Get relative time from now (e.g., "2 hours ago")
 * @param {string|Date} date - Date
 * @returns {string} Relative time string
 */
const fromNow = (date) => {
  return dayjs(date).fromNow();
};

/**
 * Check if a date is valid
 * @param {string|Date} date - Date to validate
 * @returns {boolean}
 */
const isValid = (date) => {
  return dayjs(date).isValid();
};

module.exports = {
  now,
  parse,
  format,
  toISO,
  add,
  subtract,
  diff,
  isBefore,
  isAfter,
  isSame,
  startOf,
  endOf,
  calculateHours,
  calculateDuration,
  formatDuration,
  fromNow,
  isValid,
  dayjs, // Export dayjs for advanced usage
};
