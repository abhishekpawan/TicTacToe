import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    // Get server URL from environment variables with fallback
    const serverUrl = (import.meta.env.VITE_SERVER_URL as string | undefined) || 'http://localhost:3000';
    
    // Create socket connection with auth token if available
    const socketInstance = io(serverUrl, {
      auth: { token: session?.access_token }
    }) as Socket<ServerToClientEvents, ClientToServerEvents>;
    
    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected!', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    setSocket(socketInstance);

    // Clean up socket connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user, session]); // Re-initialize socket when user or session changes

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 