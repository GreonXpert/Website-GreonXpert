// src/store/slices/heroSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import heroService from '../../services/heroService';

// Async thunk for fetching hero content
export const fetchHeroContent = createAsyncThunk(
  'hero/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await heroService.getHeroContent();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch hero content');
    }
  }
);

// Async thunk for fetching emissions data
export const fetchEmissionsData = createAsyncThunk(
  'hero/fetchEmissionsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await heroService.getEmissionsData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emissions data');
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
  chartType: 'line',
  dateRange: 'all', // 'all', '1y', '6m', '3m'
  loading: false,
  error: null
};

// Hero slice
const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    }
  },
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

// Export actions
export const { setChartType, setDateRange } = heroSlice.actions;

// Export selectors
export const selectHeroContent = (state) => state.hero.content;
export const selectEmissionsData = (state) => state.hero.emissionsData;
export const selectChartType = (state) => state.hero.chartType;
export const selectDateRange = (state) => state.hero.dateRange;
export const selectLoading = (state) => state.hero.loading;
export const selectError = (state) => state.hero.error;

// Export reducer
export default heroSlice.reducer;