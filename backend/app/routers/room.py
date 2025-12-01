from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.room_service import create_room, get_room
from app.schemas.room import RoomCreate, RoomResponse

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("/", response_model=RoomResponse)
def create_new_room(room_data: RoomCreate = RoomCreate(), db: Session = Depends(get_db)):
    """Create a new room and return the room ID"""
    room = create_room(db, room_data)
    return RoomResponse(roomId=room.id)


@router.get("/{room_id}")
def get_room_info(room_id: str, db: Session = Depends(get_db)):
    """Get room information"""
    room = get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {
        "roomId": room.id,
        "code": room.code,
        "language": room.language,
        "createdAt": room.created_at.isoformat() if room.created_at else None,
        "updatedAt": room.updated_at.isoformat() if room.updated_at else None
    }

