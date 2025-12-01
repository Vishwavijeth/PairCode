import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import type { Room, AutocompleteRequest, AutocompleteResponse } from '../types/index';

// Use proxy in development, direct URL in production
const baseURL = import.meta.env.DEV 
  ? '/api' // Vite proxy
  : API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomApi = {
  createRoom: async (language: string = 'python'): Promise<Room> => {
    const response = await api.post<{ roomId: string }>('/rooms/', { language });
    return {
      roomId: response.data.roomId,
      code: '',
      language,
    };
  },

  getRoom: async (roomId: string): Promise<Room> => {
    const response = await api.get<{
      roomId: string;
      code: string;
      language: string;
      createdAt: string;
      updatedAt: string;
    }>(`/rooms/${roomId}`);
    return {
      roomId: response.data.roomId,
      code: response.data.code,
      language: response.data.language,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
    };
  },
};

export const autocompleteApi = {
  getSuggestion: async (request: AutocompleteRequest): Promise<AutocompleteResponse> => {
    const response = await api.post<AutocompleteResponse>('/autocomplete/', request);
    return response.data;
  },
};

