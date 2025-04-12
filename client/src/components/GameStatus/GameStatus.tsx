import React, { useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { gameAPI } from '../../services/api';
import Button from '../UI/Button';
import '../../styles/GameStatus.css';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

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
  
  const { user } = useAuth();
  const { isServerless } = useSocket();

  const { winner, isDraw } = gameState;

  // Update stats when game ends (for both socket and serverless mode)
  useEffect(() => {
    // Only update stats if the game is over AND the user is logged in
    if ((isGameOver || opponentDisconnected) && user) {
      // If game ended with a result, update stats only if user is logged in
      if (gameState.winner || gameState.isDraw) {
        let result: 'win' | 'loss' | 'draw';
        
        if (gameState.isDraw) {
          result = 'draw';
          console.log('Updating stats for a draw game');
        } else if (gameState.winner === playerMark) {
          result = 'win';
          console.log('Updating stats for a win');
        } else {
          result = 'loss';
          console.log('Updating stats for a loss');
        }
        
        // Call the API to update stats (only for authenticated users)
        console.log(`Calling updateStats API with result: ${result}`);
        void gameAPI.updateStats(result)
          .then(response => {
            console.log('Stats update success:', response.data);
          })
          .catch(error => {
            console.error('Failed to update stats:', error);
          });
          
        // Wait a bit then refresh stats display
        const refreshTimer = setTimeout(() => {
          console.log('Refreshing stats display after update');
          void gameAPI.getStats()
            .then(response => {
              console.log('Stats refreshed:', response.data);
            })
            .catch(error => {
              console.error('Error refreshing stats:', error);
            });
        }, 1500);
        
        return () => clearTimeout(refreshTimer);
      }
    } else if (isGameOver || opponentDisconnected) {
      // Game ended but user is not logged in
      console.log('Game ended but stats not updated - user not logged in');
    }
  }, [isGameOver, opponentDisconnected, gameState.winner, gameState.isDraw, playerMark, user]);
  
  // Debug function to manually update stats
  const debugUpdateStats = async (result: 'win' | 'loss' | 'draw') => {
    try {
      console.log(`Manually updating stats: ${result}`);
      const response = await gameAPI.updateStats(result);
      console.log('Stats update response:', response.data);
      alert(`Stats updated: ${result}`);
    } catch (error) {
      console.error('Error updating stats:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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
      <h2>{getStatusMessage()}</h2>
      
      {opponentDisconnected && (
        <Button onClick={findMatch}>Find New Match</Button>
      )}
      
      {isGameOver && (
        <Button onClick={playAgain}>Play Again</Button>
      )}
      
      {isWaiting && (
        <div className="waiting-animation">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
      
      {/* Debug buttons for stats testing - only show in development and when user is logged in */}
      {import.meta.env.DEV && user && isServerless && isGameOver && (
        <div className="debug-buttons" style={{ marginTop: '20px', padding: '10px', border: '1px dashed #ccc' }}>
          <p>Debug: Update Stats</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => void debugUpdateStats('win')} style={{ padding: '5px 10px' }}>Win</button>
            <button onClick={() => void debugUpdateStats('loss')} style={{ padding: '5px 10px' }}>Loss</button>
            <button onClick={() => void debugUpdateStats('draw')} style={{ padding: '5px 10px' }}>Draw</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus; 