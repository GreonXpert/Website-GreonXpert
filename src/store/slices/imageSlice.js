// src/store/slices/imageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import imageService from '../../services/imageService';

// Async thunk for fetching images by category (no auth required)
export const fetchImagesByCategory = createAsyncThunk(
  'images/fetchByCategory',
  async ({ category, purpose }, { rejectWithValue }) => {
    try {
      const response = await imageService.getImagesByCategory(category, purpose);
      return { category, purpose, images: response };
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch ${category} images`);
    }
  }
);

// Initial state
const initialState = {
  images: {},  // Organized by category
  currentImage: null,
  loading: false,
  error: null,
};

// Image slice
const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
    },
    clearCurrentImage: (state) => {
      state.currentImage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch images by category cases
      .addCase(fetchImagesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImagesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { category, images } = action.payload;
        state.images[category] = images;
      })
      .addCase(fetchImagesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentImage, clearCurrentImage } = imageSlice.actions;
export default imageSlice.reducer;
