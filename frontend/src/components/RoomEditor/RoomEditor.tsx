import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRoom, clearRoom } from '../../store/slices/roomSlice';
import { setCode, setLanguage, resetEditor } from '../../store/slices/editorSlice';
import { useWebSocket } from '../../hooks/useWebSocket';
import { CodeEditor } from '../CodeEditor/CodeEditor';
import './RoomEditor.css';

export const RoomEditor: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentRoom, loading, error, isConnected } = useAppSelector((state) => state.room);
  const { code, language } = useAppSelector((state) => state.editor);

  useWebSocket(roomId || null);

  useEffect(() => {
    if (roomId) {
      dispatch(fetchRoom(roomId));
    }

    return () => {
      dispatch(clearRoom());
      dispatch(resetEditor());
    };
  }, [roomId, dispatch]);

  useEffect(() => {
    if (currentRoom) {
      dispatch(setCode(currentRoom.code));
      dispatch(setLanguage(currentRoom.language));
    }
  }, [currentRoom, dispatch]);

  const handleCodeChange = (newCode: string) => {
    // Code updates are handled by WebSocket hook
  };

  const handleBack = () => {
    navigate('/');
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      alert('Room ID copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="room-editor-container">
        <div className="loading">Loading room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-editor-container">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={handleBack} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="room-editor-container">
        <div className="error">
          <p>Room not found</p>
          <button onClick={handleBack} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="room-editor-container">
      <div className="room-editor-header">
        <div className="header-left">
          <button onClick={handleBack} className="btn-back">
            ← Back
          </button>
          <h1 className="room-title">PairCode</h1>
        </div>
        <div className="header-right">
          <div className="room-info">
            <div className="room-id-section">
              <span className="room-id-label">Room ID:</span>
              <span className="room-id-value" onClick={copyRoomId} title="Click to copy">
                {roomId}
              </span>
            </div>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              <span className="status-dot"></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      </div>
      <div className="room-editor-content">
        <CodeEditor onCodeChange={handleCodeChange} />
      </div>
    </div>
  );
};

