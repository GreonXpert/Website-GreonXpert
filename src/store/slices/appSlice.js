// src/store/slices/appSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  // Add more initial state properties as needed
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add more reducers as needed
  },
  // Add extraReducers for handling async thunks if needed
});

// Export actions
export const { setLoading, setError, clearError } = appSlice.actions;

// Export selectors
export const selectLoading = (state) => state.app.loading;
export const selectError = (state) => state.app.error;

// Export reducer
export default appSlice.reducer;