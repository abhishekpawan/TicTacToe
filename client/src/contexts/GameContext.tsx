import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { gameAPI } from '../services/api';

type Player = {
  id: string;
  mark: 'X' | 'O';
};

export type GameState = {
  board: Array<string | null>;
  currentPlayer: 'X' | 'O';
  winner: string | null;
  isDraw: boolean;
};

interface GameContextType {
  roomId: string | null;
  players: Player[];
  gameState: GameState;
  playerMark: 'X' | 'O' | null;
  isWaiting: boolean;
  isGameOver: boolean;
  opponentDisconnected: boolean;
  makeMove: (position: number) => void;
  findMatch: () => void;
  cancelMatchmaking: () => void;
  playAgain: () => void;
}

const initialGameState: GameState = {
  board: Array(9).fill(null) as (string | null)[],
  currentPlayer: 'X',
  winner: null,
  isDraw: false
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { socket, isServerless } = useSocket();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isWaiting, setIsWaiting] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  
  const isGameOver = gameState.winner !== null || gameState.isDraw;
  
  const playerMark = players.find(p => p.id === socket?.id)?.mark || null;

  // Update game stats via REST API when in serverless mode
  const updateStatsViaAPI = async (result: 'win' | 'loss' | 'draw') => {
    if (!user) return; // Skip if not authenticated
    
    try {
      await gameAPI.updateStats(result);
      console.log(`Updated stats via API: ${result}`);
    } catch (error) {
      console.error('Error updating stats via API:', error);
    }
  };

  // Hook to update stats when game ends in serverless mode
  useEffect(() => {
    if (!isGameOver || !isServerless || !user) {
      console.log('Skipping stats update - conditions not met:', { 
        isGameOver, 
        isServerless, 
        isAuthenticated: !!user 
      });
      return;
    }
    
    console.log('Game over detected, checking winner/draw status:', {
      winner: gameState.winner,
      isDraw: gameState.isDraw,
      playerMark
    });
    
    // Only update stats if it's a local game in serverless mode
    if (gameState.winner === 'X' || gameState.winner === 'O' || gameState.isDraw) {
      let result: 'win' | 'loss' | 'draw';
      
      if (gameState.isDraw) {
        result = 'draw';
      } else if (gameState.winner === playerMark) {
        result = 'win';
      } else {
        result = 'loss';
      }
      
      console.log(`Updating stats via API with result: ${result}`);
      // Use void operator to fix linting error with unhandled promise
      void updateStatsViaAPI(result);
    }
  }, [isGameOver, isServerless, gameState.winner, gameState.isDraw, user, playerMark]);

  useEffect(() => {
    if (!socket || isServerless) return;

    // Listen for a match being found
    socket.on('match-found', (data: { roomId: string; players: Player[]; gameState: GameState }) => {
      setRoomId(data.roomId);
      setPlayers(data.players);
      setGameState(data.gameState);
      setIsWaiting(false);
      setOpponentDisconnected(false);
    });

    // Listen for waiting status
    socket.on('waiting-for-opponent', () => {
      setIsWaiting(true);
    });

    // Listen for game updates
    socket.on('game-update', (updatedGameState: GameState) => {
      setGameState(updatedGameState);
    });

    // Listen for game over
    socket.on('game-over', ({ winner, isDraw }: { winner: string | null; isDraw: boolean }) => {
      setGameState(prevState => ({
        ...prevState,
        winner,
        isDraw
      }));
    });

    // Listen for game reset
    socket.on('game-reset', (newGameState: GameState) => {
      setGameState(newGameState);
      setOpponentDisconnected(false);
    });

    // Listen for opponent disconnection
    socket.on('opponent-disconnected', () => {
      setOpponentDisconnected(true);
    });

    // Clean up event listeners on unmount
    return () => {
      socket.off('match-found');
      socket.off('waiting-for-opponent');
      socket.off('game-update');
      socket.off('game-over');
      socket.off('game-reset');
      socket.off('opponent-disconnected');
    };
  }, [socket, isServerless]);

  // Function to find a match
  const findMatch = () => {
    console.log('Find match clicked, socket status:', socket ? 'connected' : 'disconnected');
    
    if (isServerless) {
      console.log('In serverless mode, using REST API for matchmaking');
      // Fallback to REST API for serverless environment
      setIsWaiting(true);
      
      // Simulate a waiting period then show message
      setTimeout(() => {
        alert('Live matchmaking is not available in this environment. Try playing locally or on the development server.');
        setIsWaiting(false);
      }, 1500);
      
      return;
    }
    
    if (!socket) {
      console.error('Socket is not connected, cannot find match');
      return;
    }
    
    setGameState(initialGameState);
    setPlayers([]);
    setRoomId(null);
    setOpponentDisconnected(false);
    
    console.log('Emitting find-match event to server');
    socket.emit('find-match');
  };

  // Function to cancel matchmaking
  const cancelMatchmaking = () => {
    if (isServerless) {
      setIsWaiting(false);
      return;
    }
    
    if (!socket) return;
    
    // Only cancel if we're actually waiting
    if (isWaiting) {
      socket.emit('cancel-matchmaking');
      setIsWaiting(false);
    }
  };

  // Function to make a move
  const makeMove = (position: number) => {
    if (isServerless) {
      // In serverless mode, implement local gameplay logic
      if (gameState.board[position] !== null || isGameOver) {
        return;
      }
      
      // Update board locally
      const newBoard = [...gameState.board];
      newBoard[position] = gameState.currentPlayer;
      
      // Check for win or draw
      const newGameState: GameState = {
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
        winner: null,
        isDraw: false
      };
      
      // Simple win check
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      
      for (const [a, b, c] of lines) {
        if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
          newGameState.winner = newBoard[a];
          console.log(`Winner detected in serverless mode: ${newGameState.winner}`);
          break;
        }
      }
      
      // Check for draw
      if (!newGameState.winner && newBoard.every(cell => cell !== null)) {
        newGameState.isDraw = true;
        console.log('Draw detected in serverless mode');
      }
      
      console.log('Updated game state:', newGameState);
      setGameState(newGameState);
      return;
    }
    
    if (!socket || !roomId || gameState.board[position] !== null || 
        gameState.currentPlayer !== playerMark || isGameOver) {
      return;
    }
    
    socket.emit('make-move', { roomId, position });
  };

  // Function to play again
  const playAgain = () => {
    if (isServerless) {
      // Reset game locally in serverless mode
      setGameState(initialGameState);
      return;
    }
    
    if (!socket || !roomId) return;
    
    socket.emit('play-again', { roomId });
  };

  return (
    <GameContext.Provider value={{
      roomId,
      players,
      gameState,
      playerMark,
      isWaiting,
      isGameOver,
      opponentDisconnected,
      makeMove,
      findMatch,
      cancelMatchmaking,
      playAgain
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 