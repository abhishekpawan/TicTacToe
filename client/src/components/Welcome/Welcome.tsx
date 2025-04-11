import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import '../../styles/Welcome.css';

const Welcome: React.FC = () => {
  const { findMatch, cancelMatchmaking, roomId, isWaiting } = useGame();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to game page if in a room
  useEffect(() => {
    if (roomId) {
      void navigate('/game');
    }
  }, [roomId, navigate]);
  
  return (
    <div className="welcome">
      <div className="welcome-content">
        <h2 className="welcome-title">Welcome to Tic Tac Toe</h2>
        <p className="welcome-text">
          Play against random opponents online! The game will automatically match you with another player.
        </p>
        
        {isWaiting ? (
          <div className="matchmaking-status">
            <p>Looking for an opponent...</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <Button 
              variant="outline" 
              onClick={cancelMatchmaking}
              className="cancel-match-btn"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="primary" 
            onClick={findMatch}
            size="large"
            className="start-game-btn"
          >
            Find a Match
          </Button>
        )}
        
        <div className="auth-info">
          {user ? (
            <p>You're logged in as {user.email}</p>
          ) : (
            <>
              <p className="auth-info-text">
                Create an account to track your game statistics!
              </p>
              <Link to="/auth" className="auth-link">
                <Button 
                  variant="secondary" 
                  size="medium"
                  className="auth-link-btn"
                >
                  Login / Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome; 