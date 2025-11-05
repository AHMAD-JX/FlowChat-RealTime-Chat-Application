import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { 
  setUserOnline, 
  setUserOffline, 
  isUserOnline,
  setTyping,
  removeTyping
} from '../config/redis';
import Message from '../models/Message.model';
import Chat from '../models/Chat.model';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

let io: Server;

export const initializeSocket = (httpServer: HTTPServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new Error('JWT_SECRET not configured'));
      }

      const decoded = jwt.verify(token, secret) as {
        id: string;
        username: string;
        email: string;
      };

      socket.userId = decoded.id;
      socket.username = decoded.username;

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`✅ User connected: ${userId} (${socket.id})`);

    // Set user online
    await setUserOnline(userId, socket.id);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Notify friends that user is online
    socket.broadcast.emit('user:online', { userId });

    // Join all user's chat rooms
    try {
      const userChats = await Chat.find({ participants: userId });
      userChats.forEach((chat) => {
        socket.join(`chat:${chat._id}`);
      });
    } catch (error) {
      console.error('Error joining chat rooms:', error);
    }

    // Handle joining a specific chat
    socket.on('chat:join', async (chatId: string) => {
      socket.join(`chat:${chatId}`);
      console.log(`User ${userId} joined chat ${chatId}`);
    });

    // Handle leaving a chat
    socket.on('chat:leave', (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${userId} left chat ${chatId}`);
    });

    // Handle sending a message
    socket.on('message:send', async (data: {
      chatId: string;
      content: string;
      type?: 'text' | 'image' | 'file' | 'video';
      fileUrl?: string;
      replyTo?: string;
    }) => {
      try {
        const { chatId, content, type = 'text', fileUrl, replyTo } = data;

        // Create message in database
        const message = await Message.create({
          chat: chatId,
          sender: userId,
          content,
          type,
          fileUrl,
          replyTo,
          isEncrypted: false,
        });

        // Populate sender info
        await message.populate('sender', 'username email');

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          lastMessageTime: message.createdAt,
        });

        // Emit message to all users in the chat (using correct format)
        io.to(`chat:${chatId}`).emit('message:receive', {
          message: {
            _id: message._id,
            chat: message.chat,
            sender: {
              _id: (message.sender as any)._id,
              username: (message.sender as any).username,
              email: (message.sender as any).email,
            },
            content: message.content,
            type: message.type,
            fileUrl: message.fileUrl,
            replyTo: message.replyTo,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            readBy: message.readBy,
            deliveredTo: message.deliveredTo,
            isDeleted: message.isDeleted,
            deletedFor: message.deletedFor,
          },
        });

        // Mark message as delivered to online users
        const chat = await Chat.findById(chatId);
        if (chat) {
          for (const participantId of chat.participants) {
            if (participantId.toString() !== userId) {
              const isOnline = await isUserOnline(participantId.toString());
              if (isOnline) {
                message.deliveredTo.push({
                  user: participantId,
                  deliveredAt: new Date(),
                });
              }
            }
          }
          await message.save();
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', async (chatId: string) => {
      await setTyping(chatId, userId);
      socket.to(`chat:${chatId}`).emit('typing:update', {
        chatId,
        userId,
        username: socket.username,
        isTyping: true,
      });
    });

    socket.on('typing:stop', async (chatId: string) => {
      await removeTyping(chatId, userId);
      socket.to(`chat:${chatId}`).emit('typing:update', {
        chatId,
        userId,
        username: socket.username,
        isTyping: false,
      });
    });

    // Handle message read receipt
    socket.on('message:read', async (data: { messageId: string; chatId: string }) => {
      try {
        const { messageId, chatId } = data;

        const message = await Message.findById(messageId);
        if (message) {
          // Add to readBy if not already read
          const alreadyRead = message.readBy.some(
            (read) => read.user.toString() === userId
          );

          if (!alreadyRead) {
            message.readBy.push({
              user: userId as any,
              readAt: new Date(),
            });
            await message.save();

            // Notify sender
            io.to(`chat:${chatId}`).emit('message:read', {
              messageId,
              userId,
              readAt: new Date(),
            });
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${userId} (${socket.id})`);
      await setUserOffline(userId);
      socket.broadcast.emit('user:offline', { userId });
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

