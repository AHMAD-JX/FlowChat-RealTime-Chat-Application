"use client";

import { useState, useEffect, useCallback } from 'react';
import { socketService } from '@/lib/socket';
import { chatService, Chat, Message, User } from '@/services/chat.service';

interface UseChat {
  chats: Chat[];
  messages: Message[];
  selectedChat: Chat | null;
  loading: boolean;
  error: string | null;
  typingUsers: string[];
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, replyTo?: string) => void;
  selectChat: (chatId: string) => void;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  markAsRead: (messageId: string, chatId: string) => void;
  createChat: (userId: string) => Promise<Chat>;
  searchUsers: (query: string) => Promise<User[]>;
}

export const useChat = (): UseChat => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Load all chats
  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedChats = await chatService.getChats();
      setChats(fetchedChats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load chats');
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a specific chat
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { messages: fetchedMessages } = await chatService.getChatMessages(chatId);
      setMessages(fetchedMessages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback((chatId: string, content: string, replyTo?: string, type: 'text' | 'image' | 'file' | 'video' = 'text', fileUrl?: string) => {
    if (!content.trim() && !fileUrl) return;
    
    socketService.sendMessage({
      chatId,
      content: content.trim(),
      type,
      fileUrl,
      replyTo,
    });
  }, []);

  // Select a chat
  const selectChat = useCallback(async (chatId: string) => {
    try {
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        setSelectedChat(chat);
        await loadMessages(chatId);
        socketService.joinChat(chatId);
      }
    } catch (err) {
      console.error('Error selecting chat:', err);
    }
  }, [chats, loadMessages]);

  // Start typing indicator
  const startTyping = useCallback((chatId: string) => {
    socketService.startTyping(chatId);
  }, []);

  // Stop typing indicator
  const stopTyping = useCallback((chatId: string) => {
    socketService.stopTyping(chatId);
  }, []);

  // Mark message as read
  const markAsRead = useCallback((messageId: string, chatId: string) => {
    socketService.markMessageAsRead(messageId, chatId);
  }, []);

  // Create new chat
  const createChat = useCallback(async (userId: string): Promise<Chat> => {
    try {
      setLoading(true);
      setError(null);
      const newChat = await chatService.createOrGetChat(userId);
      setChats(prevChats => {
        const exists = prevChats.find(c => c._id === newChat._id);
        if (exists) return prevChats;
        return [newChat, ...prevChats];
      });
      return newChat;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search users
  const searchUsers = useCallback(async (query: string): Promise<User[]> => {
    try {
      return await chatService.searchUsers(query);
    } catch (err: any) {
      console.error('Error searching users:', err);
      return [];
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (data: { message: Message }) => {
      setMessages(prevMessages => [...prevMessages, data.message]);
      
      // Update last message in chats list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === data.message.chat
            ? { ...chat, lastMessage: data.message, lastMessageTime: data.message.createdAt }
            : chat
        )
      );
    };

    // Listen for typing updates
    const handleTypingUpdate = (data: { chatId: string; userId: string; isTyping: boolean }) => {
      if (selectedChat && data.chatId === selectedChat._id) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return prev.includes(data.userId) ? prev : [...prev, data.userId];
          } else {
            return prev.filter(id => id !== data.userId);
          }
        });
      }
    };

    // Listen for message read receipts
    const handleMessageRead = (data: { messageId: string; userId: string; readAt: Date }) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === data.messageId
            ? {
                ...msg,
                readBy: [
                  ...msg.readBy,
                  { user: data.userId, readAt: data.readAt },
                ],
              }
            : msg
        )
      );
    };

    // Listen for user online/offline status
    const handleUserOnline = (data: { userId: string }) => {
      setChats(prevChats =>
        prevChats.map(chat => ({
          ...chat,
          participants: chat.participants.map(p =>
            p._id === data.userId ? { ...p, online: true } : p
          ),
        }))
      );
    };

    const handleUserOffline = (data: { userId: string }) => {
      setChats(prevChats =>
        prevChats.map(chat => ({
          ...chat,
          participants: chat.participants.map(p =>
            p._id === data.userId ? { ...p, online: false } : p
          ),
        }))
      );
    };

    // Register listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onTypingUpdate(handleTypingUpdate);
    socketService.onMessageRead(handleMessageRead);
    socketService.onUserOnline(handleUserOnline);
    socketService.onUserOffline(handleUserOffline);

    // Cleanup
    return () => {
      socketService.removeListener('message:receive', handleNewMessage);
      socketService.removeListener('typing:update', handleTypingUpdate);
      socketService.removeListener('message:read', handleMessageRead);
      socketService.removeListener('user:online', handleUserOnline);
      socketService.removeListener('user:offline', handleUserOffline);
    };
  }, [selectedChat]);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    chats,
    messages,
    selectedChat,
    loading,
    error,
    typingUsers,
    loadChats,
    loadMessages,
    sendMessage,
    selectChat,
    startTyping,
    stopTyping,
    markAsRead,
    createChat,
    searchUsers,
  };
};

