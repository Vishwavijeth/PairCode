from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RoomCreate(BaseModel):
    language: Optional[str] = "python"


class RoomResponse(BaseModel):
    roomId: str
    
    class Config:
        from_attributes = True


class RoomCodeUpdate(BaseModel):
    code: str
    cursorPosition: Optional[int] = None


class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str = "python"


class AutocompleteResponse(BaseModel):
    suggestion: str
    startPosition: int
    endPosition: int

