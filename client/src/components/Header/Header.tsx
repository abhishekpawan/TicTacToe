import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import '../../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="game-title">Tic Tac Toe</h1>
      <ThemeToggle />
    </header>
  );
};

export default Header; 