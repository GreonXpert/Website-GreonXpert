// src/services/emissionService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Fetch all emissions data
export const getAllEmissions = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/emissions/`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching emissions data' };
  }
};

// Fetch emissions data for a specific year
export const getEmissionByYear = async (year) => {
  try {
    const response = await axios.get(`${API_URL}/api/emissions/${year}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching emissions data for year ${year}` };
  }
};

// Fetch emissions statistics
export const getEmissionsStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/emissions/stats/summary`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching emissions statistics' };
  }
};

// Fetch emissions data with year range filter
export const getEmissionsByYearRange = async (startYear, endYear) => {
  try {
    const response = await axios.get(`${API_URL}/api/emissions/`, {
      params: { startYear, endYear }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching emissions data by year range' };
  }
};

export default {
  getAllEmissions,
  getEmissionByYear,
  getEmissionsStats,
  getEmissionsByYearRange
};
