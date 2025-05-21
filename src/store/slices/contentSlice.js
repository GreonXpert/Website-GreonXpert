// src/store/slices/contentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';

// Async thunk for fetching all content sections
export const fetchAllContent = createAsyncThunk(
  'content/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await contentService.getAllContent();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch content');
    }
  }
);

// Async thunk for fetching content by section
export const fetchContentBySection = createAsyncThunk(
  'content/fetchBySection',
  async (section, { rejectWithValue }) => {
    try {
      const content = await contentService.getContentBySection(section);
      return { section, content };
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch ${section} content`);
    }
  }
);

// Async thunk for fetching content history of a section
export const fetchContentHistory = createAsyncThunk(
  'content/fetchHistory',
  async (section, { rejectWithValue }) => {
    try {
      const history = await contentService.getContentHistory(section);
      return { section, history };
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch ${section} content history`);
    }
  }
);

const initialState = {
  sections: {},
  history: {},
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    builder
      // Fetch all content
      .addCase(fetchAllContent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        state.loading = false;
        const sections = {};
        action.payload.forEach(item => {
          sections[item.section] = item.content;
        });
        state.sections = sections;
      })
      .addCase(fetchAllContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch content by section
      .addCase(fetchContentBySection.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentBySection.fulfilled, (state, action) => {
        state.loading = false;
        state.sections[action.payload.section] = action.payload.content;
      })
      .addCase(fetchContentBySection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch content history
      .addCase(fetchContentHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history[action.payload.section] = action.payload.history;
      })
      .addCase(fetchContentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = contentSlice.actions;
export default contentSlice.reducer;
