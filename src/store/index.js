// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';

// Import slices
import appReducer from './slices/appSlice';
import heroReducer from './slices/heroSlice';
import contentReducer from './slices/contentSlice';
import emissionReducer from './slices/emissionSlice';
import imageReducer from './slices/imageSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    hero: heroReducer,
    content: contentReducer,
    emissions: emissionReducer,
    images: imageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
