import React from 'react';
import Welcome from '../components/Welcome/Welcome';
import GameStatus from '../components/GameStatus/GameStatus';
import Board from '../components/Board/Board';
import '../styles/App.css';

const Home: React.FC = () => {
  return (
    <main className="main-content">
      <Welcome />
      <GameStatus />
      <Board />
    </main>
  );
};

export default Home; 