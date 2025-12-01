from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import room, autocomplete, websocket
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Real-time pair programming application",
    version="1.0.0"
)

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(room.router)
app.include_router(autocomplete.router)
app.include_router(websocket.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "PairCode API",
        "version": "1.0.0",
        "endpoints": {
            "create_room": "POST /rooms/",
            "get_room": "GET /rooms/{room_id}",
            "autocomplete": "POST /autocomplete/",
            "websocket": "WS /ws/{room_id}"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

