# PairCode - Real-Time Pair Programming Application

A full-stack real-time pair-programming web application that allows multiple users to join the same room, edit code simultaneously, and see each other's changes instantly. The system also provides AI-style autocomplete suggestions (mocked).

## 🚀 Features

- **Room Creation & Joining**: Users can create new rooms or join existing ones via room IDs
- **Real-Time Collaborative Coding**: WebSocket-based synchronization for instant code updates
- **AI Autocomplete**: Mocked autocomplete suggestions based on code context and language
- **Database Storage**: Room state and code are persisted in PostgreSQL (with automatic fallback to SQLite)
- **Modern Frontend**: React + TypeScript + Redux with a clean, responsive UI
- **Full-Stack Integration**: Seamless connection between frontend and backend

## 📁 Project Structure

```
PairCode/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database setup
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── routers/        # API routes
│   │   └── utils/          # Utilities
│   ├── requirements.txt
│   └── README.md
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API & WebSocket
│   │   ├── hooks/         # Custom hooks
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── README.md
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+ (optional - will fallback to SQLite if not available)
- pip and npm

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
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
   ```sql
   CREATE DATABASE paircode;
   ```
   - Update `app/config.py` or set environment variable:
     ```bash
     export POSTGRESQL_URL="postgresql://username:password@localhost:5432/paircode"
     ```
   
   **Option B: SQLite (Automatic fallback)**
   - If PostgreSQL is not available, the application will automatically use SQLite
   - No additional setup required!

5. **Run the backend**:
   ```bash
   python start.py
   # or
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

## 🎯 Usage

### Starting the Application

1. **Start the backend** (from `backend/` directory):
   ```bash
   python start.py
   ```

2. **Start the frontend** (from `frontend/` directory, in a new terminal):
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

### Creating a Room

1. On the home page, select a programming language
2. Click "Create Room"
3. You'll be redirected to the editor with a unique room ID
4. Share the room ID with others to collaborate

### Joining a Room

1. Enter a room ID in the "Join Existing Room" section
2. Click "Join Room"
3. You'll be redirected to the editor where you can see and edit code in real-time

### Features

- **Real-Time Sync**: Code changes are instantly visible to all users in the room
- **Autocomplete**: Suggestions appear after 600ms of inactivity (press Tab to accept)
- **Connection Status**: See if you're connected to the room (green/red indicator)
- **Copy Room ID**: Click on the room ID to copy it to clipboard

## 📡 API Endpoints

### REST Endpoints

- `POST /rooms/` - Create a new room
- `GET /rooms/{room_id}` - Get room information
- `POST /autocomplete/` - Get autocomplete suggestions

### WebSocket

- `WS /ws/{room_id}` - Real-time code collaboration

See `backend/README.md` for detailed API documentation.

## 🏗️ Architecture

### Backend

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: ORM for database operations
- **WebSockets**: Real-time bidirectional communication
- **PostgreSQL**: Persistent data storage

### Frontend

- **React 19**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **WebSocket API**: Real-time communication

## 🔧 Development

### Backend Development

- API documentation: `http://localhost:8000/docs` (Swagger UI)
- Alternative docs: `http://localhost:8000/redoc`

### Frontend Development

- Hot module replacement enabled
- TypeScript type checking
- ESLint for code quality

## 📝 Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://postgres:postgres@localhost:5432/paircode`)
- `DEBUG`: Enable debug mode (default: `True`)

### Frontend

- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)
- `VITE_WS_URL`: WebSocket URL (default: `ws://localhost:8000`)




