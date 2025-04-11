import React from 'react';
import { useGame } from '../../contexts/GameContext';
import Button from '../UI/Button';
import '../../styles/GameStatus.css';

const GameStatus: React.FC = () => {
  const { 
    gameState, 
    playerMark, 
    isWaiting, 
    isGameOver, 
    opponentDisconnected,
    playAgain,
    findMatch
  } = useGame();

  const { winner, isDraw } = gameState;

  // Helper function to get status message
  const getStatusMessage = () => {
    if (opponentDisconnected) {
      return "Your opponent disconnected";
    }
    
    if (isWaiting) {
      return "Waiting for an opponent to join...";
    }
    
    if (isDraw) {
      return "It's a draw!";
    }
    
    if (winner) {
      return winner === playerMark 
        ? "You won! 🎉" 
        : "You lost 😔";
    }
    
    return "";
  };

  // If there's no status to show, don't render the component
  if (!isWaiting && !isGameOver && !opponentDisconnected) {
    return null;
  }

  return (
    <div className="game-status">
      <h2 className="status-message">{getStatusMessage()}</h2>
      
      {(isGameOver || opponentDisconnected) && (
        <div className="game-actions">
          {!opponentDisconnected && (
            <Button 
              variant="primary" 
              onClick={playAgain}
              className="game-action-btn"
            >
              Play Again
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={findMatch}
            className="game-action-btn"
          >
            Find New Match
          </Button>
        </div>
      )}
      
      {isWaiting && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default GameStatus; 