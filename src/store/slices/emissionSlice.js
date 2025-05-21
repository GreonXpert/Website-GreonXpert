// src/store/slices/emissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import emissionService from '../../services/emissionService';

// Fetch all emissions data
export const fetchAllEmissions = createAsyncThunk(
  'emissions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await emissionService.getAllEmissions(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emissions data');
    }
  }
);

// Fetch emissions data by year range
export const fetchEmissionsByYearRange = createAsyncThunk(
  'emissions/fetchByYearRange',
  async ({ startYear, endYear }, { rejectWithValue }) => {
    try {
      const data = await emissionService.getEmissionsByYearRange(startYear, endYear);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emissions data by year range');
    }
  }
);

// Fetch emissions statistics
export const fetchEmissionsStats = createAsyncThunk(
  'emissions/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await emissionService.getEmissionsStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emissions statistics');
    }
  }
);

const initialState = {
  emissions: [],
  stats: null,
  loading: false,
  error: null,
};

const emissionSlice = createSlice({
  name: 'emissions',
  initialState,
  reducers: {
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllEmissions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.emissions = action.payload;
      })
      .addCase(fetchAllEmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmissionsByYearRange.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmissionsByYearRange.fulfilled, (state, action) => {
        state.loading = false;
        state.emissions = action.payload;
      })
      .addCase(fetchEmissionsByYearRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmissionsStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmissionsStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEmissionsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = emissionSlice.actions;
export default emissionSlice.reducer;
