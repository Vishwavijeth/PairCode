import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface EditorState {
  code: string;
  cursorPosition: number;
  language: string;
  isTyping: boolean;
}

const initialState: EditorState = {
  code: '',
  cursorPosition: 0,
  language: 'python',
  isTyping: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setCursorPosition: (state, action: PayloadAction<number>) => {
      state.cursorPosition = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    resetEditor: (state) => {
      state.code = '';
      state.cursorPosition = 0;
      state.isTyping = false;
    },
  },
});

export const {
  setCode,
  setCursorPosition,
  setLanguage,
  setIsTyping,
  resetEditor,
} = editorSlice.actions;
export default editorSlice.reducer;

