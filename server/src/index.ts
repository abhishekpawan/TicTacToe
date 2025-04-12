import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameState, ServerToClientEvents, ClientToServerEvents } from './types/socket.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Game room interface
interface Room {
  id: string;
  players: { id: string; mark: 'X' | 'O' }[];
  gameState: GameState;
  isActive: boolean;
}

const rooms = new Map<string, Room>();
const waitingPlayers = new Set<string>();

// Check if the game is over
const checkGameOver = (board: Array<string | null>): { winner: string | null; isDraw: boolean } => {
  // Winning combinations: rows, columns, diagonals
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], isDraw: false };
    }
  }

  // Check for draw
  if (board.every(cell => cell !== null)) {
    return { winner: null, isDraw: true };
  }

  return { winner: null, isDraw: false };
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a player wants to find a match
  socket.on('find-match', () => {
    const playerId = socket.id;
    
    // If there's another player waiting, create a room for them to play
    if (waitingPlayers.size > 0) {
      const waitingPlayer = Array.from(waitingPlayers)[0];
      waitingPlayers.delete(waitingPlayer);
      
      const roomId = `room_${Date.now()}`;
      
      // Create a new room with both players
      const newRoom: Room = {
        id: roomId,
        players: [
          { id: waitingPlayer, mark: 'X' },
          { id: playerId, mark: 'O' }
        ],
        gameState: {
          board: Array(9).fill(null) as (string | null)[],
          currentPlayer: 'X',
          winner: null,
          isDraw: false
        },
        isActive: true
      };
      
      rooms.set(roomId, newRoom);
      
      // Make both players join the room
      socket.join(roomId);
      io.sockets.sockets.get(waitingPlayer)?.join(roomId);
      
      // Notify players about the match
      io.to(roomId).emit('match-found', {
        roomId,
        players: newRoom.players,
        gameState: newRoom.gameState
      });
      
      console.log(`Match created: ${waitingPlayer} vs ${playerId} in ${roomId}`);
    } else {
      // If no players are waiting, add this player to the waiting list
      waitingPlayers.add(playerId);
      socket.emit('waiting-for-opponent');
      console.log(`Player ${playerId} is waiting for an opponent`);
    }
  });

  // When a player cancels matchmaking
  socket.on('cancel-matchmaking', () => {
    const playerId = socket.id;
    
    // Remove the player from the waiting list
    if (waitingPlayers.has(playerId)) {
      waitingPlayers.delete(playerId);
      console.log(`Player ${playerId} canceled matchmaking`);
    }
  });

  // When a player makes a move
  socket.on('make-move', async ({ roomId, position }) => {
    const room = rooms.get(roomId);
    
    if (!room || !room.isActive) return;
    
    const { board, currentPlayer } = room.gameState;
    const player = room.players.find(p => p.id === socket.id);
    
    // Check if it's this player's turn and the move is valid
    if (player?.mark !== currentPlayer || board[position] !== null) {
      return;
    }
    
    // Make the move
    const newBoard = [...board];
    newBoard[position] = currentPlayer;
    
    // Check if the game is over after this move
    const { winner, isDraw } = checkGameOver(newBoard);
    
    // Update game state
    room.gameState = {
      board: newBoard,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isDraw
    };
    
    // Broadcast updated game state to both players
    io.to(roomId).emit('game-update', room.gameState);
    
    // If the game is over, clean up
    if (winner || isDraw) {
      console.log(`Game over in room ${roomId}: winner=${winner}, isDraw=${isDraw}`);
      io.to(roomId).emit('game-over', { winner, isDraw });
      room.isActive = false;
      
      // Get player sockets to get their auth data for stats update
      const player1Socket = io.sockets.sockets.get(room.players[0].id);
      const player2Socket = io.sockets.sockets.get(room.players[1].id);
      
      console.log('Player sockets:', {
        player1Available: !!player1Socket,
        player2Available: !!player2Socket,
        player1HasToken: !!player1Socket?.handshake.auth.token,
        player2HasToken: !!player2Socket?.handshake.auth.token,
        player1Id: room.players[0].id,
        player2Id: room.players[1].id
      });
      
      // Process each player independently for stats updates
      // Import the updateGameStats function here to avoid circular dependencies
      const processPlayerStats = async (playerSocket: any, playerMark: 'X' | 'O') => {
        // Skip if player socket not available
        if (!playerSocket) {
          console.log(`Player socket not available for mark ${playerMark}, skipping stats update`);
          return;
        }
        
        // Skip if player not authenticated
        const authToken = playerSocket.handshake.auth.token;
        if (!authToken) {
          console.log(`Player with mark ${playerMark} is not authenticated, skipping stats update`);
          return;
        }
        
        try {
          // Get user ID from auth token
          const result = await supabase.auth.getUser(authToken);
          const userId = result.data.user?.id;
          
          // Skip if user ID not found
          if (!userId) {
            console.log(`Could not resolve user ID for player with mark ${playerMark}, skipping stats update`);
            return;
          }
          
          console.log(`Updating stats for player ${playerMark} (${userId})`);
          
          // Import the updateGameStats function here to avoid circular dependencies
          const { updateGameStats } = await import('./models/User.js');
          
          // Update based on game result
          if (isDraw) {
            console.log(`Registering a draw for player ${playerMark}`);
            await updateGameStats(userId, { 
              games_played: 1, 
              games_tied: 1 
            });
          } else if (winner === playerMark) {
            console.log(`Registering a win for player ${playerMark}`);
            await updateGameStats(userId, { 
              games_played: 1, 
              games_won: 1 
            });
          } else {
            console.log(`Registering a loss for player ${playerMark}`);
            await updateGameStats(userId, { 
              games_played: 1, 
              games_lost: 1 
            });
          }
          console.log(`Successfully updated stats for player ${playerMark} (${userId})`);
        } catch (error) {
          console.error(`Error updating stats for player ${playerMark}:`, error);
        }
      };
      
      // Process each player independently - don't let one player's error affect the other
      try {
        await processPlayerStats(player1Socket, room.players[0].mark);
      } catch (error) {
        console.error('Error processing player 1 stats:', error);
      }
      
      try {
        await processPlayerStats(player2Socket, room.players[1].mark);
      } catch (error) {
        console.error('Error processing player 2 stats:', error);
      }
      
      // Clean up after 10 minutes
      setTimeout(() => {
        rooms.delete(roomId);
        console.log(`Room ${roomId} has been deleted after timeout`);
      }, 10 * 60 * 1000);
    }
  });

  // When a player wants to play again
  socket.on('play-again', ({ roomId }) => {
    const room = rooms.get(roomId);
    
    if (!room) return;
    
    // Reset the game state
    room.gameState = {
      board: Array(9).fill(null) as (string | null)[],
      currentPlayer: 'X',
      winner: null,
      isDraw: false
    };
    room.isActive = true;
    
    // Broadcast the new game state
    io.to(roomId).emit('game-reset', room.gameState);
  });

  // When a player disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove from waiting list
    waitingPlayers.delete(socket.id);
    
    // Notify opponent if in a room
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        // Notify the other player
        const opponentIndex = playerIndex === 0 ? 1 : 0;
        if (opponentIndex < room.players.length) {
          const opponentId = room.players[opponentIndex].id;
          io.to(opponentId).emit('opponent-disconnected');
        }
        
        // Mark room as inactive
        room.isActive = false;
        
        // Clean up the room after a timeout
        setTimeout(() => {
          rooms.delete(roomId);
          console.log(`Room ${roomId} has been deleted after player disconnect`);
        }, 10 * 60 * 1000);
        
        break;  // Player can only be in one room
      }
    }
  });
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the TicTacToe API' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 

export default app;