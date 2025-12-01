from typing import Dict, Set
from fastapi import WebSocket
import json
from app.database import SessionLocal
from app.services.room_service import get_or_create_room, update_room_code


class ConnectionManager:
    """Manages WebSocket connections for real-time collaboration"""
    
    def __init__(self):
        # room_id -> set of websocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Store room code in memory for faster access
        self.room_code_cache: Dict[str, str] = {}
    
    async def connect(self, websocket: WebSocket, room_id: str):
        """Accept a new WebSocket connection and add it to the room"""
        await websocket.accept()
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = set()
        
        self.active_connections[room_id].add(websocket)
        
        # Load initial code from database
        db = SessionLocal()
        try:
            room = get_or_create_room(db, room_id)
            self.room_code_cache[room_id] = room.code
            
            # Send current code to the newly connected client
            await websocket.send_json({
                "type": "code_update",
                "code": room.code,
                "roomId": room_id
            })
        finally:
            db.close()
    
    def disconnect(self, websocket: WebSocket, room_id: str):
        """Remove a WebSocket connection from the room"""
        if room_id in self.active_connections:
            self.active_connections[room_id].discard(websocket)
            
            # Clean up if no connections left
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
                if room_id in self.room_code_cache:
                    del self.room_code_cache[room_id]
    
    async def broadcast_code_update(self, room_id: str, code: str, sender: WebSocket):
        """Broadcast code updates to all clients in the room except the sender"""
        if room_id not in self.active_connections:
            return
        
        # Update cache
        self.room_code_cache[room_id] = code
        
        # Update database asynchronously (in a real app, use background tasks)
        db = SessionLocal()
        try:
            update_room_code(db, room_id, code)
        finally:
            db.close()
        
        # Broadcast to all other clients
        message = {
            "type": "code_update",
            "code": code,
            "roomId": room_id
        }
        
        disconnected = set()
        for connection in self.active_connections[room_id]:
            if connection != sender:
                try:
                    await connection.send_json(message)
                except Exception:
                    # Connection is dead, mark for removal
                    disconnected.add(connection)
        
        # Clean up disconnected clients
        for connection in disconnected:
            self.active_connections[room_id].discard(connection)
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific client"""
        await websocket.send_json(message)
    
    def get_room_code(self, room_id: str) -> str:
        """Get the current code for a room from cache"""
        return self.room_code_cache.get(room_id, "")


# Global connection manager instance
manager = ConnectionManager()

