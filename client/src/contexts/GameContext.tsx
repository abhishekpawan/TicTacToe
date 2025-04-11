import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSocket } from './SocketContext';

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
  const { socket } = useSocket();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isWaiting, setIsWaiting] = useState(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  
  const isGameOver = gameState.winner !== null || gameState.isDraw;
  
  const playerMark = players.find(p => p.id === socket?.id)?.mark || null;

  useEffect(() => {
    if (!socket) return;

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
  }, [socket]);

  // Function to find a match
  const findMatch = () => {
    console.log('Find match clicked, socket status:', socket ? 'connected' : 'disconnected');
    
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
    if (!socket) return;
    
    // Only cancel if we're actually waiting
    if (isWaiting) {
      socket.emit('cancel-matchmaking');
      setIsWaiting(false);
    }
  };

  // Function to make a move
  const makeMove = (position: number) => {
    if (!socket || !roomId || gameState.board[position] !== null || 
        gameState.currentPlayer !== playerMark || isGameOver) {
      return;
    }
    
    socket.emit('make-move', { roomId, position });
  };

  // Function to play again
  const playAgain = () => {
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