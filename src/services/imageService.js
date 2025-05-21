// src/services/imageService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Axios instance without auth
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/images`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all images with optional filters
export const getAllImages = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching images' };
  }
};

// Get images by category and optional purpose
export const getImagesByCategory = async (category, purpose = null) => {
  try {
    const params = purpose ? { purpose } : {};
    const response = await axiosInstance.get(`/category/${category}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching ${category} images` };
  }
};

// Get single image by ID
export const getImageById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching image' };
  }
};

// Get image statistics
export const getImageStats = async () => {
  try {
    const response = await axiosInstance.get('/stats/summary');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching image statistics' };
  }
};

export default {
  getAllImages,
  getImagesByCategory,
  getImageById,
  getImageStats
};
