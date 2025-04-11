import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Navigation.css';
import { FaHome, FaGamepad, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useGame } from '../../contexts/GameContext';

const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const { roomId } = useGame();

  const handleSignOut = () => {
    signOut().catch(error => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <nav className="bottom-navigation fixed-nav">
      <div className="nav-container">
        <NavLink 
          to="/welcome" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FaHome className="nav-icon" />
          <span className="nav-label">Home</span>
        </NavLink>
        
        {roomId && (
          <NavLink 
            to="/game" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <FaGamepad className="nav-icon" />
            <span className="nav-label">Game</span>
          </NavLink>
        )}
        
        {!user ? (
          <NavLink 
            to="/auth" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <FaSignInAlt className="nav-icon" />
            <span className="nav-label">Login</span>
          </NavLink>
        ) : (
          <>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <FaUser className="nav-icon" />
              <span className="nav-label">Profile</span>
            </NavLink>
            <button 
              className="nav-item logout-button" 
              onClick={handleSignOut}
            >
              <FaSignOutAlt className="nav-icon" />
              <span className="nav-label">Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 