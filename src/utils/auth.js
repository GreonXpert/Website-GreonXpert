//src/utils/auth.js
// Utility functions for authentication

/**
 * Get authentication token from localStorage
 * @returns {string} JWT token
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} isAuthenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated
};