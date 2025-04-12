import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  isServerless: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isServerless, setIsServerless] = useState(false);
  const { session } = useAuth();
  
  useEffect(() => {
    // Get the backend URL from environment variables, with fallback
    const SOCKET_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000';
    
    console.log('Connecting to socket server at:', SOCKET_URL);
    
    // Create socket connection with auth if available, but it's optional
    const authConfig = session?.access_token 
      ? { token: session.access_token }
      : {};
      
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: authConfig
    });
    
    console.log('Socket created with auth token:', session?.access_token ? 'present' : 'not available');
    
    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      setIsServerless(false);
    });
    
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      // Check if we're likely in a serverless environment
      if (SOCKET_URL.includes('vercel')) {
        console.log('Detected serverless environment, disabling socket.io');
        setIsServerless(true);
      }
      setIsConnected(false);
    });
    
    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });
    
    // Save socket in state
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [session]); // Recreate socket when session changes
  
  return (
    <SocketContext.Provider value={{ socket, isConnected, isServerless }}>
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