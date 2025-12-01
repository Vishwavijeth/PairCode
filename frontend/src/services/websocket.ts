import { WS_BASE_URL } from '../config/api';
import type { WebSocketMessage } from '../types/index';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.roomId === roomId) {
        resolve();
        return;
      }

      this.roomId = roomId;
      // Use direct WebSocket connection (Vite proxy doesn't work well with WebSockets)
      const wsUrl = `${WS_BASE_URL}/ws/${roomId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.emit('connection_status', { status: 'connected' });
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.emit(message.type, message);
        } catch (error) {
          // If it's not JSON, treat it as a code update
          this.emit('code_update', { type: 'code_update', code: event.data });
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        this.emit('connection_status', { status: 'disconnected' });
        this.attemptReconnect();
      };
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.roomId) {
      this.reconnectAttempts++;
      setTimeout(() => {
        if (this.roomId) {
          this.connect(this.roomId).catch(console.error);
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  sendCodeUpdate(code: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'code_update',
        code,
      }));
    }
  }

  sendCursorUpdate(cursorPosition: number, userId: string = 'user'): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'cursor_update',
        cursorPosition,
        userId,
      }));
    }
  }

  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.roomId = null;
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();

