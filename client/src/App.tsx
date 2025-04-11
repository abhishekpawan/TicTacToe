import React from 'react';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { GameProvider } from './contexts/GameContext';
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import GameStatus from './components/GameStatus/GameStatus';
import Welcome from './components/Welcome/Welcome';

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <GameProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Welcome />
              <GameStatus />
              <Board />
            </main>
            <footer className="footer">
              <p>&copy; {new Date().getFullYear()} Tic Tac Toe Online</p>
            </footer>
          </div>
        </GameProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
