# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Make sure PostgreSQL is running and create database
# In PostgreSQL:
CREATE DATABASE paircode;

# Start backend server
python start.py
```

Backend will run on `http://localhost:8000`

### Step 2: Frontend Setup

```bash
# Open a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 3: Use the Application

1. Open `http://localhost:5173` in your browser
2. Click "Create Room" to start a new coding session
3. Share the room ID with a collaborator
4. Start coding! Changes sync in real-time

## 🧪 Testing

### Test REST API

Visit `http://localhost:8000/docs` for interactive API documentation.

### Test WebSocket

1. Create a room in the frontend
2. Open the same room in another browser tab/window
3. Type in one window and see changes appear in the other

### Test Autocomplete

1. Type code in the editor
2. Wait 600ms after stopping
3. A suggestion should appear at the bottom
4. Press `Tab` to accept or `Esc` to dismiss

## 📝 Notes

- Backend must be running before starting the frontend
- Both services can run simultaneously
- Database tables are created automatically on first run
- WebSocket connections reconnect automatically if dropped

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database exists
- Check DATABASE_URL in `app/config.py`

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check browser console for errors
- Verify CORS is enabled (it is by default)

### WebSocket not working
- Check backend logs for WebSocket errors
- Verify room ID is correct
- Check browser console for connection errors

