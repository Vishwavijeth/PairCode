import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AutocompleteResponse } from '../../types/index';
import { autocompleteApi } from '../../services/api';

interface AutocompleteState {
  suggestion: AutocompleteResponse | null;
  loading: boolean;
  error: string | null;
  isVisible: boolean;
}

const initialState: AutocompleteState = {
  suggestion: null,
  loading: false,
  error: null,
  isVisible: false,
};

export const fetchAutocomplete = createAsyncThunk(
  'autocomplete/fetch',
  async (params: { code: string; cursorPosition: number; language: string }) => {
    return await autocompleteApi.getSuggestion(params);
  }
);

const autocompleteSlice = createSlice({
  name: 'autocomplete',
  initialState,
  reducers: {
    setSuggestion: (state, action: PayloadAction<AutocompleteResponse | null>) => {
      state.suggestion = action.payload;
      state.isVisible = action.payload !== null;
    },
    hideSuggestion: (state) => {
      state.isVisible = false;
      state.suggestion = null;
    },
    clearAutocomplete: (state) => {
      state.suggestion = null;
      state.isVisible = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutocomplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAutocomplete.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestion = action.payload;
        state.isVisible = true;
      })
      .addCase(fetchAutocomplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get autocomplete';
        state.isVisible = false;
      });
  },
});

export const { setSuggestion, hideSuggestion, clearAutocomplete } = autocompleteSlice.actions;
export default autocompleteSlice.reducer;

