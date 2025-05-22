// src/store/slices/heroSlice.js - Updated to properly fetch from backend
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Async thunk for fetching hero content
export const fetchHeroContent = createAsyncThunk(
  'hero/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      // First try to fetch from the backend API
      const response = await axios.get(`${API_URL}/api/content/hero`);
      
      // If successful, return the content data
      if (response.data && response.data.success) {
        return response.data.data.content;
      }
      
      // If we didn't get valid data, use the fallback content
      return {
        microHeading: "INNOVATIVE SOLUTIONS",
        mainHeading: "Transforming Business Through Digital Excellence",
        tagLine: "Custom Software Development and Technology Consulting",
        subHeading: "Partner with us to drive innovation, optimize operations, and achieve sustainable growth with our expertise in custom software solutions."
      };
    } catch (error) {
      console.warn('Error fetching hero content, using fallback data:', error);
      
      // Return fallback content in case of error
      return {
        microHeading: "INNOVATIVE SOLUTIONS",
        mainHeading: "Transforming Business Through Digital Excellence",
        tagLine: "Custom Software Development and Technology Consulting",
        subHeading: "Partner with us to drive innovation, optimize operations, and achieve sustainable growth with our expertise in custom software solutions."
      };
    }
  }
);

// Async thunk for fetching emissions data
export const fetchEmissionsData = createAsyncThunk(
  'hero/fetchEmissionsData',
  async (_, { rejectWithValue }) => {
    try {
      // Try to fetch emissions data from the backend
      const response = await axios.get(`${API_URL}/api/emissions`);
      
      // If successful, return the emissions data
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      // If there's a problem with the data structure, use sample data
      return [
        { year: 2023, scope1: 84.8, scope2: 70, scope3: 143, total: 297.8 },
        { year: 2022, scope1: 95.0, scope2: 80, scope3: 160, total: 335.0 },
        { year: 2021, scope1: 105.0, scope2: 90, scope3: 175, total: 370.0 },
        { year: 2020, scope1: 115.0, scope2: 100, scope3: 190, total: 405.0 },
        { year: 2019, scope1: 125.0, scope2: 110, scope3: 200, total: 435.0 }
      ];
    } catch (error) {
      console.warn('Error fetching emissions data, using sample data:', error);
      
      // Return sample data in case of error
      return [
        { year: 2023, scope1: 84.8, scope2: 70, scope3: 143, total: 297.8 },
        { year: 2022, scope1: 95.0, scope2: 80, scope3: 160, total: 335.0 },
        { year: 2021, scope1: 105.0, scope2: 90, scope3: 175, total: 370.0 },
        { year: 2020, scope1: 115.0, scope2: 100, scope3: 190, total: 405.0 },
        { year: 2019, scope1: 125.0, scope2: 110, scope3: 200, total: 435.0 }
      ];
    }
  }
);

// Initial state
const initialState = {
  content: {
    microHeading: '',
    mainHeading: '',
    tagLine: '',
    subHeading: ''
  },
  emissionsData: [],
  loading: false,
  error: null
};

// Hero slice
const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch hero content cases
      .addCase(fetchHeroContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchHeroContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch emissions data cases
      .addCase(fetchEmissionsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmissionsData.fulfilled, (state, action) => {
        state.loading = false;
        state.emissionsData = action.payload;
      })
      .addCase(fetchEmissionsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export selectors
export const selectHeroContent = (state) => state.hero.content;
export const selectEmissionsData = (state) => state.hero.emissionsData;
export const selectLoading = (state) => state.hero.loading;
export const selectError = (state) => state.hero.error;

// Export reducer
export default heroSlice.reducer;