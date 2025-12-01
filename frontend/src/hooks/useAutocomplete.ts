import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAutocomplete } from '../store/slices/autocompleteSlice';
import { setIsTyping } from '../store/slices/editorSlice';

const TYPING_DELAY = 600; // ms

export const useAutocomplete = () => {
  const dispatch = useAppDispatch();
  const { code, cursorPosition, language } = useAppSelector((state) => state.editor);
  const { isVisible, suggestion } = useAppSelector((state) => state.autocomplete);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing state
    dispatch(setIsTyping(true));

    // Set timeout to fetch autocomplete after user stops typing
    typingTimeoutRef.current = setTimeout(() => {
      dispatch(setIsTyping(false));
      
      // Only fetch if there's code and cursor position is valid
      if (code && cursorPosition >= 0) {
        dispatch(fetchAutocomplete({
          code,
          cursorPosition,
          language,
        }));
      }
    }, TYPING_DELAY);

    // Cleanup
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [code, cursorPosition, language, dispatch]);

  return { isVisible, suggestion };
};

