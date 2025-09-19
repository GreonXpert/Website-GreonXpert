import axios from 'axios';
import { API_BASE } from '../utils/api';

const API_URL = `${API_BASE}/api/emissions`;

/**
 * Fetches all emissions data from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of emissions data.
 */
const getAllEmissions = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { params });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching emissions data:', error);
    return [];
  }
};

/**
 * Fetches emissions data within a specific year range.
 * @param {number} startYear - The starting year of the range.
 * @param {number} endYear - The ending year of the range.
 * @returns {Promise<Array>} A promise that resolves to an array of emissions data.
 */
const getEmissionsByYearRange = async (startYear, endYear) => {
  return getAllEmissions({ startYear, endYear });
};

/**
 * Fetches summary statistics for emissions data.
 * @returns {Promise<Object>} A promise that resolves to an object with statistics.
 */
const getEmissionsStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats/summary`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return {};
  } catch (error) {
    console.error('Error fetching emissions stats:', error);
    return {};
  }
};


// Export all functions as a single default object
const emissionService = {
  getAllEmissions,
  getEmissionsByYearRange,
  getEmissionsStats,
};

export default emissionService;
