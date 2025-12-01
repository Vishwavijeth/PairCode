from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.ws_manager import manager
import json

router = APIRouter()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """WebSocket endpoint for real-time code collaboration"""
    await manager.connect(websocket, room_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                message_type = message.get("type")
                
                if message_type == "code_update":
                    code = message.get("code", "")
                    # Broadcast to all other clients in the room
                    await manager.broadcast_code_update(room_id, code, websocket)
                
                elif message_type == "cursor_update":
                    # Broadcast cursor position to other clients
                    cursor_data = {
                        "type": "cursor_update",
                        "cursorPosition": message.get("cursorPosition"),
                        "userId": message.get("userId", "unknown")
                    }
                    # Broadcast to all other clients
                    if room_id in manager.active_connections:
                        for connection in manager.active_connections[room_id]:
                            if connection != websocket:
                                try:
                                    await connection.send_json(cursor_data)
                                except Exception:
                                    pass
                
            except json.JSONDecodeError:
                # If it's not JSON, treat it as a direct code update
                await manager.broadcast_code_update(room_id, data, websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
    except Exception as e:
        manager.disconnect(websocket, room_id)
        raise

