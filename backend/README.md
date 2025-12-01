# PairCode - Real-Time Pair Programming Application

A simplified real-time pair-programming web application that allows two users to join the same room, edit code simultaneously, and see each other's changes instantly. The system also provides AI-style autocomplete suggestions (mocked).

## Features

- **Room Creation & Joining**: Users can create new rooms or join existing ones via room IDs
- **Real-Time Collaborative Coding**: WebSocket-based synchronization for instant code updates
- **AI Autocomplete**: Mocked autocomplete suggestions based on code context and language
- **Database Storage**: Room state and code are persisted in PostgreSQL (with automatic fallback to SQLite)

## Architecture

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Application configuration
│   ├── database.py             # Database connection and session management
│   ├── models/
│   │   └── room.py             # SQLAlchemy room model
│   ├── schemas/
│   │   └── room.py             # Pydantic schemas for request/response
│   ├── services/
│   │   ├── room_service.py     # Room business logic
│   │   ├── autocomplete_service.py  # Autocomplete suggestion logic
│   │   └── ws_manager.py       # WebSocket connection management
│   ├── routers/
│   │   ├── room.py             # Room REST endpoints
│   │   ├── autocomplete.py     # Autocomplete REST endpoint
│   │   └── websocket.py        # WebSocket endpoint
│   └── utils/
│       └── id_generator.py     # Room ID generation utility
├── requirements.txt
└── README.md
```

### Design Choices

1. **WebSocket Manager**: Centralized connection management using a singleton pattern to track active connections per room
2. **In-Memory Cache**: Room code is cached in memory for faster access, with database updates happening asynchronously
3. **Last-Write-Wins**: Simple synchronization approach where the latest code update overwrites previous state
4. **Rule-Based Autocomplete**: Mocked suggestions based on common code patterns and language-specific keywords
5. **Database**: Automatic database selection - uses PostgreSQL if available, falls back to SQLite for easier development

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL 12+ (optional - will fallback to SQLite if not available)
- pip (Python package manager)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Database** (optional):
   
   **Option A: PostgreSQL (Recommended for production)**
   - Create a database named `paircode`:
     ```sql
     CREATE DATABASE paircode;
     ```
   - Update the PostgreSQL URL in `app/config.py` or set it via environment variable:
     ```bash
     export POSTGRESQL_URL="postgresql://username:password@localhost:5432/paircode"
     ```
   
   **Option B: SQLite (Automatic fallback)**
   - If PostgreSQL is not available, the application will automatically use SQLite
   - SQLite database file will be created at `paircode.db` in the backend directory
   - No additional setup required!

5. **Run the application**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

6. **Access API documentation**:
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### REST Endpoints

#### 1. Create Room
- **POST** `/rooms/`
- **Request Body** (optional):
  ```json
  {
    "language": "python"
  }
  ```
- **Response**:
  ```json
  {
    "roomId": "abc12345"
  }
  ```

#### 2. Get Room Info
- **GET** `/rooms/{room_id}`
- **Response**:
  ```json
  {
    "roomId": "abc12345",
    "code": "",
    "language": "python",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
  ```

#### 3. Autocomplete
- **POST** `/autocomplete/`
- **Request Body**:
  ```json
  {
    "code": "def ",
    "cursorPosition": 4,
    "language": "python"
  }
  ```
- **Response**:
  ```json
  {
    "suggestion": "def function_name():\n    pass",
    "startPosition": 4,
    "endPosition": 4
  }
  ```

### WebSocket Endpoint

#### Real-Time Code Collaboration
- **WS** `/ws/{room_id}`

**Message Format (Client → Server)**:
```json
{
  "type": "code_update",
  "code": "print('Hello, World!')"
}
```

**Message Format (Server → Client)**:
```json
{
  "type": "code_update",
  "code": "print('Hello, World!')",
  "roomId": "abc12345"
}
```

**Cursor Update (optional)**:
```json
{
  "type": "cursor_update",
  "cursorPosition": 10,
  "userId": "user1"
}
```

## Testing with Postman/Browser

### Testing REST Endpoints

1. **Create a Room**:
   - Method: POST
   - URL: `http://localhost:8000/rooms/`
   - Body (JSON):
     ```json
     {
       "language": "python"
     }
     ```
   - You'll receive a `roomId` in response

2. **Get Autocomplete**:
   - Method: POST
   - URL: `http://localhost:8000/autocomplete/`
   - Body (JSON):
     ```json
     {
       "code": "def ",
       "cursorPosition": 4,
       "language": "python"
     }
     ```

### Testing WebSocket

You can test WebSocket connections using:
- **Browser Console**: Use the WebSocket API
- **Postman**: Use the WebSocket request feature
- **Online Tools**: Use tools like `websocket.org/echo.html`

**Example Browser Console Test**:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/abc12345');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({
    type: 'code_update',
    code: 'print("Hello")'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

## Limitations

1. **No Authentication**: Rooms are accessible to anyone with the room ID
2. **Simple Sync**: Uses last-write-wins approach, which may cause conflicts in high-frequency editing
3. **No Operational Transform**: Lacks advanced conflict resolution mechanisms
4. **Mocked Autocomplete**: Suggestions are rule-based, not AI-powered
5. **Single Server**: Not designed for horizontal scaling (would need Redis/pub-sub for multi-server)
6. **No User Presence**: Doesn't show who is currently editing
7. **No History**: No code history or undo/redo functionality

## Improvements with More Time

1. **Operational Transform (OT) or CRDTs**: Implement proper conflict resolution for simultaneous edits
2. **User Presence**: Show active users, cursors, and selections
3. **Code History**: Implement version history and undo/redo
4. **Real AI Autocomplete**: Integrate with OpenAI Codex, GitHub Copilot, or similar
5. **Authentication**: Add user authentication and authorization
6. **Room Permissions**: Add read-only, read-write permissions
7. **Syntax Highlighting**: Support for multiple languages with proper highlighting
8. **File Management**: Support multiple files per room
9. **Horizontal Scaling**: Use Redis pub/sub for multi-server WebSocket support
10. **Rate Limiting**: Add rate limiting to prevent abuse
11. **Error Handling**: More robust error handling and recovery
12. **Testing**: Comprehensive unit and integration tests
13. **Monitoring**: Add logging, metrics, and monitoring
14. **Frontend**: Build a complete React frontend with Monaco Editor or CodeMirror

## Development Notes

- The application uses SQLAlchemy ORM for database operations
- WebSocket connections are managed in-memory (not suitable for production scaling)
- Database migrations are handled automatically via SQLAlchemy (for production, use Alembic)
- CORS is enabled for all origins (restrict in production)

## License

This project is for demonstration purposes.

