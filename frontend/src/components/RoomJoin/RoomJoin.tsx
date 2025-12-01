import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { createRoom, fetchRoom } from '../../store/slices/roomSlice';
import './RoomJoin.css';

export const RoomJoin: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [language, setLanguage] = useState('python');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const result = await dispatch(createRoom(language));
      if (createRoom.fulfilled.match(result)) {
        navigate(`/room/${result.payload.roomId}`);
      }
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }

    setIsJoining(true);
    try {
      const result = await dispatch(fetchRoom(roomId.trim()));
      if (fetchRoom.fulfilled.match(result)) {
        navigate(`/room/${roomId.trim()}`);
      } else {
        alert('Room not found. Please check the room ID.');
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="room-join-container">
      <div className="room-join-card">
        <h1 className="app-title">PairCode</h1>
        <p className="app-subtitle">Real-Time Pair Programming</p>

        <div className="room-join-section">
          <h2>Create New Room</h2>
          <div className="form-group">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
            </select>
          </div>
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="btn btn-primary"
          >
            {isCreating ? 'Creating...' : 'Create Room'}
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="room-join-section">
          <h2>Join Existing Room</h2>
          <div className="form-group">
            <label htmlFor="roomId">Room ID:</label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="room-id-input"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
          </div>
          <button
            onClick={handleJoinRoom}
            disabled={isJoining || !roomId.trim()}
            className="btn btn-secondary"
          >
            {isJoining ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

