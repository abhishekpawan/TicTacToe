import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import '../../styles/Navigation.css';

const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const { roomId } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut().catch(error => {
      console.error('Error signing out:', error);
    });
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navigation">
      <button 
        className="hamburger-menu" 
        onClick={toggleMenu} 
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <div className={`nav-container ${isOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/welcome" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={closeMenu}
            >
              Welcome
            </NavLink>
          </li>
          
          {roomId && (
            <li>
              <NavLink 
                to="/game" 
                className={({ isActive }) => isActive ? 'active' : ''} 
                onClick={closeMenu}
              >
                Game
              </NavLink>
            </li>
          )}
          
          {!user ? (
            <li>
              <NavLink 
                to="/auth" 
                className={({ isActive }) => isActive ? 'active' : ''} 
                onClick={closeMenu}
              >
                Login
              </NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => isActive ? 'active' : ''} 
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <button className="logout-button" onClick={handleSignOut}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navigation; 