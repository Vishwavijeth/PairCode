export interface Room {
  roomId: string;
  code: string;
  language: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AutocompleteRequest {
  code: string;
  cursorPosition: number;
  language: string;
}

export interface AutocompleteResponse {
  suggestion: string;
  startPosition: number;
  endPosition: number;
}

export interface WebSocketMessage {
  type: 'code_update' | 'cursor_update' | 'connection_status';
  code?: string;
  roomId?: string;
  cursorPosition?: number;
  userId?: string;
  status?: 'connected' | 'disconnected';
}

export type Language = 'python' | 'javascript' | 'java' | 'typescript';

