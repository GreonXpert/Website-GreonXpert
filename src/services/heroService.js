// src/services/heroService.js
import axios from 'axios';

// Base URL for API calls (can be changed to your actual API endpoint)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For now, we'll simulate data fetching with local data from localStorage
// This can be replaced with actual API calls when available
const heroService = {
  // Get hero section content
  getHeroContent: async () => {
    // In production, this would be an API call
    // return apiClient.get('/api/hero-content');
    
    // Simulate API response with predefined content
    return Promise.resolve({
      data: {
        microHeading: "INNOVATIVE SOLUTIONS",
        mainHeading: "Transforming Business Through Digital Excellence",
        tagLine: "Custom Software Development and Technology Consulting",
        subHeading: "Partner with us to drive innovation, optimize operations, and achieve sustainable growth with our expertise in custom software solutions."
      }
    });
  },
  
  // Get emissions data from localStorage or fallback to sample data
  getEmissionsData: async () => {
    try {
      // Try to get data from localStorage (from the dashboard)
      const storedData = localStorage.getItem('emissionsData');
      if (storedData) {
        return Promise.resolve({ data: JSON.parse(storedData) });
      }
      
      // Fallback to sample data if nothing in localStorage
      return Promise.resolve({
        data: [
          { 
            year: 2023, 
            scope1: 84.8, 
            scope2: 70, 
            scope3: 143,
            target: 340
          },
          { 
            year: 2022, 
            scope1: 95.0, 
            scope2: 80, 
            scope3: 160,
            target: 360
          },
          { 
            year: 2021, 
            scope1: 105.0, 
            scope2: 90, 
            scope3: 175,
            target: 380
          },
          { 
            year: 2020, 
            scope1: 115.0, 
            scope2: 100, 
            scope3: 190,
            target: 400
          },
          { 
            year: 2019, 
            scope1: 125.0, 
            scope2: 110, 
            scope3: 200,
            target: 420
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching emissions data:', error);
      throw error;
    }
  }
};

export default heroService;