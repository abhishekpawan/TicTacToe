import React from 'react';
import { useGame } from '../../contexts/GameContext';
import './Welcome.css';

const Welcome: React.FC = () => {
  const { findMatch, roomId, isWaiting } = useGame();
  
  // Don't show welcome screen if in a room or waiting for opponent
  if (roomId || isWaiting) {
    return null;
  }
  
  return (
    <div className="welcome">
      <div className="welcome-content">
        <h2 className="welcome-title">Welcome to Tic Tac Toe</h2>
        <p className="welcome-text">
          Play against random opponents online! The game will automatically match you with another player.
        </p>
        <button className="start-game-btn" onClick={findMatch}>
          Find a Match
        </button>
      </div>
    </div>
  );
};

export default Welcome; 