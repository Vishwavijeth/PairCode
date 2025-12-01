# PairCode Frontend

React + TypeScript + Redux frontend for the PairCode real-time pair programming application.

## Features

- **Room Management**: Create new rooms or join existing ones
- **Real-Time Collaboration**: WebSocket-based code synchronization
- **AI Autocomplete**: Context-aware code suggestions (mocked)
- **Modern UI**: Clean, responsive design with smooth animations
- **Type Safety**: Full TypeScript support

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CodeEditor/      # Code editor with autocomplete
│   │   ├── RoomJoin/        # Room creation/joining UI
│   │   └── RoomEditor/      # Main editor page
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx
│   │   └── RoomPage.tsx
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   │   ├── roomSlice.ts
│   │   │   ├── editorSlice.ts
│   │   │   └── autocompleteSlice.ts
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── index.ts         # Store configuration
│   ├── services/            # API and WebSocket services
│   │   ├── api.ts           # REST API client
│   │   └── websocket.ts     # WebSocket service
│   ├── hooks/               # Custom React hooks
│   │   ├── useAutocomplete.ts
│   │   └── useWebSocket.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── config/              # Configuration
│   │   └── api.ts
│   ├── App.tsx              # Main app component
│   ├── App.css
│   └── main.tsx             # Entry point
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend server running on `http://localhost:8000`

### Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API URL** (optional):
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_WS_URL=ws://localhost:8000
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Usage

### Creating a Room

1. Navigate to the home page
2. Select a programming language
3. Click "Create Room"
4. You'll be redirected to the editor with a unique room ID

### Joining a Room

1. Enter a room ID in the "Join Existing Room" section
2. Click "Join Room"
3. You'll be redirected to the editor

### Real-Time Collaboration

- Code changes are automatically synchronized with other users in the same room
- Connection status is shown in the header (green = connected, red = disconnected)
- The room ID can be copied by clicking on it

### Autocomplete

- Suggestions appear automatically after you stop typing for 600ms
- Press `Tab` to accept a suggestion
- Press `Esc` to dismiss a suggestion

## Technologies

- **React 19**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **React Router**: Routing
- **Axios**: HTTP client
- **Vite**: Build tool and dev server
- **WebSocket API**: Real-time communication

## Development

### Code Structure

- **Components**: Reusable UI components with their own CSS files
- **Pages**: Route-level components that compose smaller components
- **Store**: Redux slices for room, editor, and autocomplete state
- **Services**: API and WebSocket communication layer
- **Hooks**: Custom React hooks for autocomplete and WebSocket management

### State Management

The app uses Redux Toolkit with three main slices:

1. **roomSlice**: Manages room data, connection status, and room operations
2. **editorSlice**: Manages editor state (code, cursor position, language)
3. **autocompleteSlice**: Manages autocomplete suggestions

### WebSocket Integration

The `useWebSocket` hook:
- Connects to the backend WebSocket endpoint
- Listens for code updates from other users
- Sends local code changes to the server
- Handles reconnection automatically

### Autocomplete Integration

The `useAutocomplete` hook:
- Debounces typing (600ms delay)
- Fetches suggestions from the backend API
- Manages suggestion visibility state

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)
- `VITE_WS_URL`: WebSocket URL (default: `ws://localhost:8000`)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- The code editor uses a simple textarea. For production, consider using Monaco Editor or CodeMirror for better syntax highlighting and features
- WebSocket reconnection is automatic with exponential backoff
- All API calls are typed with TypeScript interfaces
