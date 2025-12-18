"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '@/lib/socket';
import { authService } from '@/services/auth.service';

interface SocketContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    const token = authService.getToken();
    if (token && !socketService.isConnected()) {
      socketService.connect(token);
      
      // Check connection status after a short delay
      const checkConnection = () => {
        const socket = socketService.getSocket();
        if (socket) {
          setIsConnected(socket.connected);
          
          // Listen for connection events
          socket.on('connect', () => {
            setIsConnected(true);
          });
          
          socket.on('disconnect', () => {
            setIsConnected(false);
          });
        }
      };
      
      // Check immediately and after a short delay
      setTimeout(checkConnection, 100);
      setTimeout(checkConnection, 1000);
    } else if (socketService.isConnected()) {
      setIsConnected(true);
    }
  };

  const disconnect = () => {
    socketService.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    // Auto-connect if user is authenticated
    if (authService.isAuthenticated()) {
      connect();
    }

    // Periodically check connection status
    const interval = setInterval(() => {
      if (authService.isAuthenticated()) {
        const connected = socketService.isConnected();
        setIsConnected(connected);
        
        // Reconnect if disconnected
        if (!connected) {
          connect();
        }
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

