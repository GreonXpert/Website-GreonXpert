// src/services/contentService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Get all content sections
export const getAllContent = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/content/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching content' };
  }
};

// Get content for a specific section
export const getContentBySection = async (section) => {
  try {
    const response = await axios.get(`${API_URL}/api/content/${section}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching ${section} content` };
  }
};

// Get content history for a section
export const getContentHistory = async (section) => {
  try {
    const response = await axios.get(`${API_URL}/api/content/${section}/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching ${section} content history` };
  }
};

export default {
  getAllContent,
  getContentBySection,
  getContentHistory
};
