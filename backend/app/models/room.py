from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime


class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(String, primary_key=True, index=True)
    code = Column(Text, default="")
    language = Column(String, default="python")
    # DateTime without timezone works with both PostgreSQL and SQLite
    # PostgreSQL will store it, SQLite will use its native datetime format
    created_at = Column(DateTime, server_default=func.now(), default=datetime.utcnow)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=datetime.utcnow, default=datetime.utcnow)

