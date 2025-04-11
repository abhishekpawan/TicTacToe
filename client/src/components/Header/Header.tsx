import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import Navigation from '../Navigation/Navigation';
import '../../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="game-title">Tic Tac Toe</h1>
      <div className="header-right">
        <ThemeToggle />
        <Navigation />
      </div>
    </header>
  );
};

export default Header; 