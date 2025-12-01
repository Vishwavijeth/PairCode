# How to Run PairCode

Complete step-by-step guide to run both backend and frontend.

## 📋 Prerequisites Check

Before starting, make sure you have:
- ✅ Python 3.8+ installed
- ✅ Node.js 18+ and npm installed
- ✅ PostgreSQL (optional - will use SQLite if not available)

## 🚀 Quick Start (Two Terminal Windows)

### Terminal 1: Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start backend server
python start.py
```

**Expected Output:**
```
✓ Connected to PostgreSQL database
# OR
✓ Using SQLite database: paircode.db

INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Backend is now running at: **http://localhost:8000**

### Terminal 2: Frontend

```bash
# Open a NEW terminal window
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start frontend dev server
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Frontend is now running at: **http://localhost:5173**

## 🌐 Access the Application

1. Open your browser
2. Navigate to: **http://localhost:5173**
3. You should see the PairCode home page

## ✅ Verify Everything Works

### Check Backend
- Visit: http://localhost:8000/docs (Swagger UI)
- Visit: http://localhost:8000/health (should return `{"status": "healthy"}`)

### Check Frontend
- Open: http://localhost:5173
- Click "Create Room"
- You should be redirected to the editor

## 🛑 Stopping the Services

- **Backend**: Press `Ctrl+C` in Terminal 1
- **Frontend**: Press `Ctrl+C` in Terminal 2

## 🔄 Alternative Commands

### Backend Alternatives

```bash
# Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Using uvicorn with specific workers
uvicorn app.main:app --reload --workers 4
```

### Frontend Alternatives

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐛 Common Issues & Solutions

### Issue: Backend won't start

**Error: Module not found**
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Error: Port 8000 already in use**
```bash
# Find and kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

### Issue: Frontend won't start

**Error: Port 5173 already in use**
- Vite will automatically try the next available port
- Or kill the process: `lsof -ti:5173 | xargs kill -9`

**Error: Cannot connect to backend**
- Make sure backend is running first
- Check backend is on http://localhost:8000
- Check browser console for CORS errors

### Issue: Database connection

**PostgreSQL connection failed**
- This is normal! The app will automatically use SQLite
- You'll see: `✓ Using SQLite database: paircode.db`
- No action needed - SQLite works perfectly for development

## 📝 Development Workflow

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   venv\Scripts\activate  # or source venv/bin/activate
   python start.py
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Make Changes**
   - Backend: Changes auto-reload (thanks to `--reload` flag)
   - Frontend: Changes hot-reload automatically (Vite HMR)

4. **Test Changes**
   - Refresh browser
   - Check both terminals for errors

## 🎯 First Time Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Virtual environment created and activated
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can create a room in the app

## 💡 Pro Tips

1. **Keep both terminals open** - You need both services running
2. **Check terminal output** - Errors will show in the terminal
3. **Backend must start first** - Frontend needs backend to be running
4. **Database auto-creates** - No need to manually create tables
5. **SQLite is fine for dev** - Don't worry if PostgreSQL isn't set up

## 🎉 You're Ready!

Once both services are running:
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Open the frontend URL in your browser and start coding!

