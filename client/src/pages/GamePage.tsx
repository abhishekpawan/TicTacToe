import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Board from '../components/Board/Board';
import { useGame } from '../contexts/GameContext';
import '../styles/App.css';
import GameStatus from '../components/GameStatus/GameStatus';

const GamePage: React.FC = () => {
  const { roomId, isWaiting, cancelMatchmaking } = useGame();

  // Cancel matchmaking when leaving the game screen
  useEffect(() => {
    return () => {
      if (isWaiting) {
        cancelMatchmaking();
      }
    };
  }, [isWaiting, cancelMatchmaking]);

  // Redirect if not in a game room
  if (!roomId) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div className="game-page">
      <main className="main-content">
        <GameStatus/>
        <Board />
      </main>
    </div>
  );
};

export default GamePage; 