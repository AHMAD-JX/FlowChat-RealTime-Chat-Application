import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  /**
   * Initialize socket connection
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.token = token;

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join a chat room
   */
  joinChat(chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('chat:join', chatId);
    }
  }

  /**
   * Leave a chat room
   */
  leaveChat(chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('chat:leave', chatId);
    }
  }

  /**
   * Send a message
   */
  sendMessage(data: {
    chatId: string;
    content: string;
    type?: 'text' | 'image' | 'file' | 'video';
    fileUrl?: string;
    replyTo?: string;
  }): void {
    if (this.socket?.connected) {
      this.socket.emit('message:send', data);
    }
  }

  /**
   * Start typing indicator
   */
  startTyping(chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('typing:start', chatId);
    }
  }

  /**
   * Stop typing indicator
   */
  stopTyping(chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('typing:stop', chatId);
    }
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId: string, chatId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('message:read', { messageId, chatId });
    }
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('message:receive', callback);
    }
  }

  /**
   * Listen for typing updates
   */
  onTypingUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('typing:update', callback);
    }
  }

  /**
   * Listen for message read receipts
   */
  onMessageRead(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('message:read', callback);
    }
  }

  /**
   * Listen for user online status
   */
  onUserOnline(callback: (data: { userId: string }) => void): void {
    if (this.socket) {
      this.socket.on('user:online', callback);
    }
  }

  /**
   * Listen for user offline status
   */
  onUserOffline(callback: (data: { userId: string }) => void): void {
    if (this.socket) {
      this.socket.on('user:offline', callback);
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Remove specific listener
   */
  removeListener(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();

