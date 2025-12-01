import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './slices/roomSlice';
import editorReducer from './slices/editorSlice';
import autocompleteReducer from './slices/autocompleteSlice';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    editor: editorReducer,
    autocomplete: autocompleteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

