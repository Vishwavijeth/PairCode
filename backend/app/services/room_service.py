from sqlalchemy.orm import Session
from app.models.room import Room
from app.utils.id_generator import generate_room_id
from app.schemas.room import RoomCreate


def create_room(db: Session, room_data: RoomCreate) -> Room:
    """Create a new room"""
    room_id = generate_room_id()
    room = Room(
        id=room_id,
        code="",
        language=room_data.language
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


def get_room(db: Session, room_id: str) -> Room:
    """Get a room by ID"""
    return db.query(Room).filter(Room.id == room_id).first()


def update_room_code(db: Session, room_id: str, code: str) -> Room:
    """Update the code content of a room"""
    room = get_room(db, room_id)
    if room:
        room.code = code
        db.commit()
        db.refresh(room)
    return room


def get_or_create_room(db: Session, room_id: str) -> Room:
    """Get a room or create it if it doesn't exist"""
    room = get_room(db, room_id)
    if not room:
        room = Room(
            id=room_id,
            code="",
            language="python"
        )
        db.add(room)
        db.commit()
        db.refresh(room)
    return room

