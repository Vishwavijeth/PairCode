import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { wsService } from '../services/websocket';
import { updateRoomCode, setConnectionStatus } from '../store/slices/roomSlice';
import { setCode } from '../store/slices/editorSlice';

export const useWebSocket = (roomId: string | null) => {
  const dispatch = useAppDispatch();
  const { code } = useAppSelector((state) => state.editor);
  const isInitialMount = useRef(true);
  const codeRef = useRef(code);

  // Keep code ref updated
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (!roomId) return;

    // Connect to WebSocket
    wsService.connect(roomId).catch(console.error);

    // Listen for code updates from other users
    const unsubscribeCodeUpdate = wsService.on('code_update', (message) => {
      if (message.code !== undefined && message.code !== codeRef.current) {
        dispatch(setCode(message.code));
        dispatch(updateRoomCode(message.code));
      }
    });

    // Listen for connection status
    const unsubscribeConnection = wsService.on('connection_status', (message) => {
      dispatch(setConnectionStatus(message.status === 'connected'));
    });

    // Cleanup on unmount
    return () => {
      unsubscribeCodeUpdate();
      unsubscribeConnection();
      wsService.disconnect();
    };
  }, [roomId, dispatch]);

  // Send code updates when local code changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (roomId && wsService.isConnected()) {
      wsService.sendCodeUpdate(code);
    }
  }, [code, roomId]);

  return {
    isConnected: wsService.isConnected(),
    sendCodeUpdate: (code: string) => wsService.sendCodeUpdate(code),
  };
};

