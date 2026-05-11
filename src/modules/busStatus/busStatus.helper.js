/**
 * Helper logic for bus status determination
 */

/**
 * Determines the status of a bus based on its speed.
 * @param {number} speed - The speed of the bus in km/h.
 * @returns {string} - "moving" or "stopped".
 */
export const determineStatusFromSpeed = (speed) => {
  if (speed > 5) {
    return "moving";
  }
  return "stopped";
};

/**
 * Checks if a bus is offline based on the last update timestamp.
 * @param {Date|string} lastUpdateAt - The timestamp of the last GPS update.
 * @param {number} thresholdMinutes - Minutes before considering a bus offline (default 10).
 * @returns {boolean} - True if the bus is offline.
 */
export const checkIsOffline = (lastUpdateAt, thresholdMinutes = 10) => {
  if (!lastUpdateAt) return true;
  
  const lastUpdate = new Date(lastUpdateAt);
  const now = new Date();
  const diffInMinutes = (now - lastUpdate) / (1000 * 60);
  
  return diffInMinutes > thresholdMinutes;
};
