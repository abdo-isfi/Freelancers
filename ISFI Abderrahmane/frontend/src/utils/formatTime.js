/**
 * Format minutes into Hh Mm format (e.g., 90 -> 1h 30m)
 * @param {number} minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (!minutes) return "0m";
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

/**
 * Format decimal hours into Hh Mm format (e.g., 1.5 -> 1h 30m)
 * @param {number} decimalHours
 * @returns {string}
 */
export const formatDecimalHours = (decimalHours) => {
  if (!decimalHours) return "0m";
  
  const totalMinutes = decimalHours * 60;
  return formatDuration(totalMinutes);
};
