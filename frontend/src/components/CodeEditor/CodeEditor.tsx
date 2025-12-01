import React, { useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCode, setCursorPosition } from '../../store/slices/editorSlice';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import './CodeEditor.css';

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ onCodeChange }) => {
  const dispatch = useAppDispatch();
  const { code, cursorPosition, language } = useAppSelector((state) => state.editor);
  const { suggestion, isVisible } = useAutocomplete();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    setShowSuggestion(isVisible && suggestion !== null);
  }, [isVisible, suggestion]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    dispatch(setCode(newCode));
    dispatch(setCursorPosition(e.target.selectionStart));
    onCodeChange?.(newCode);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    dispatch(setCursorPosition(e.currentTarget.selectionStart));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Accept suggestion with Tab
    if (e.key === 'Tab' && showSuggestion && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    }
    // Dismiss suggestion with Escape
    if (e.key === 'Escape' && showSuggestion) {
      setShowSuggestion(false);
    }
  };

  const acceptSuggestion = () => {
    if (!suggestion || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = suggestion.startPosition;
    const end = suggestion.endPosition;
    const before = code.substring(0, start);
    const after = code.substring(end);
    const newCode = before + suggestion.suggestion + after;

    dispatch(setCode(newCode));
    setShowSuggestion(false);
    onCodeChange?.(newCode);

    // Set cursor position after the suggestion
    setTimeout(() => {
      const newPosition = start + suggestion.suggestion.length;
      textarea.setSelectionRange(newPosition, newPosition);
      dispatch(setCursorPosition(newPosition));
    }, 0);
  };

  // Get language class for syntax highlighting (basic)
  const getLanguageClass = () => {
    return `language-${language}`;
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor-wrapper">
        <textarea
          ref={textareaRef}
          className={`code-editor ${getLanguageClass()}`}
          value={code}
          onChange={handleChange}
          onSelect={handleSelect}
          onKeyDown={handleKeyDown}
          placeholder={`Start coding in ${language}...`}
          spellCheck={false}
        />
        {showSuggestion && suggestion && (
          <div className="autocomplete-suggestion">
            <div className="suggestion-header">
              <span>Suggestion (Press Tab to accept, Esc to dismiss)</span>
            </div>
            <div className="suggestion-content">
              <pre>{suggestion.suggestion}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

