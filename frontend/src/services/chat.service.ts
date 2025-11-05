import { api } from '@/lib/api';

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  online?: boolean;
}

export interface Message {
  _id: string;
  chat: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isEncrypted: boolean;
  readBy: Array<{ user: string; readAt: Date }>;
  deliveredTo: Array<{ user: string; deliveredAt: Date }>;
  isDeleted: boolean;
  replyTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  _id: string;
  participants: User[];
  isGroupChat: boolean;
  groupName?: string;
  groupAvatar?: string;
  groupAdmin?: string;
  lastMessage?: Message;
  lastMessageTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class ChatService {
  /**
   * Create or get a one-on-one chat
   */
  async createOrGetChat(userId: string): Promise<Chat> {
    const response = await api.post('/chat', { userId });
    return response.data.data;
  }

  /**
   * Get all chats for current user
   */
  async getChats(): Promise<Chat[]> {
    const response = await api.get('/chat');
    return response.data.data;
  }

  /**
   * Get chat by ID
   */
  async getChatById(chatId: string): Promise<Chat> {
    const response = await api.get(`/chat/${chatId}`);
    return response.data.data;
  }

  /**
   * Get messages for a chat
   */
  async getChatMessages(
    chatId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    messages: Message[];
    totalPages: number;
    currentPage: number;
  }> {
    const response = await api.get(`/chat/${chatId}/messages`, {
      params: { page, limit },
    });
    return {
      messages: response.data.data,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  }

  /**
   * Create a group chat
   */
  async createGroupChat(
    participants: string[],
    groupName: string
  ): Promise<Chat> {
    const response = await api.post('/chat/group', {
      participants,
      groupName,
    });
    return response.data.data;
  }

  /**
   * Delete a message
   */
  async deleteMessage(
    messageId: string,
    deleteForEveryone: boolean = false
  ): Promise<void> {
    await api.delete(`/chat/message/${messageId}`, {
      data: { deleteForEveryone },
    });
  }

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get('/chat/search/users', {
      params: { query },
    });
    return response.data.data;
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<void> {
    await api.delete(`/chat/${chatId}`);
  }

  /**
   * Upload media file (image/video)
   */
  async uploadMedia(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
    const formData = new FormData();
    formData.append('media', file);

    const response = await api.post('/chat/upload-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }
}

export const chatService = new ChatService();

