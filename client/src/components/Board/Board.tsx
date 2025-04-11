import React from 'react';
import { useGame } from '../../contexts/GameContext';
import './Board.css';
import Cell from './Cell';

const Board: React.FC = () => {
  const { gameState, makeMove, playerMark, isGameOver } = useGame();
  const { board, currentPlayer } = gameState;

  const isPlayerTurn = currentPlayer === playerMark;
  
  return (
    <div className="board-container">
      <div className={`board ${isGameOver ? 'game-over' : ''}`}>
        {board.map((value, index) => (
          <Cell 
            key={index}
            value={value}
            index={index}
            onClick={() => makeMove(index)}
            isActive={isPlayerTurn && !value && !isGameOver}
          />
        ))}
      </div>
      {!isGameOver && (
        <div className="turn-indicator">
          {isPlayerTurn ? (
            <span className="your-turn">Your turn ({playerMark})</span>
          ) : (
            <span className="opponent-turn">Opponent's turn</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Board; 