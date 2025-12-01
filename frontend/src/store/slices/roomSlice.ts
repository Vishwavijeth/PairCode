import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Room } from '../../types/index';
import { roomApi } from '../../services/api';

interface RoomState {
  currentRoom: Room | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

const initialState: RoomState = {
  currentRoom: null,
  loading: false,
  error: null,
  isConnected: false,
};

export const createRoom = createAsyncThunk(
  'room/create',
  async (language: string = 'python') => {
    return await roomApi.createRoom(language);
  }
);

export const fetchRoom = createAsyncThunk(
  'room/fetch',
  async (roomId: string) => {
    return await roomApi.getRoom(roomId);
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
    },
    updateRoomCode: (state, action: PayloadAction<string>) => {
      if (state.currentRoom) {
        state.currentRoom.code = action.payload;
      }
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    clearRoom: (state) => {
      state.currentRoom = null;
      state.error = null;
      state.isConnected = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create room';
      })
      .addCase(fetchRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch room';
      });
  },
});

export const { setRoom, updateRoomCode, setConnectionStatus, clearRoom } = roomSlice.actions;
export default roomSlice.reducer;

