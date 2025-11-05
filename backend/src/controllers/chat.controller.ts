import { Request, Response, NextFunction } from 'express';
import Chat from '../models/Chat.model';
import Message from '../models/Message.model';
import User from '../models/User.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { isUserOnline } from '../config/redis';
import path from 'path';

// @desc    Create or get a one-on-one chat
// @route   POST /api/chat
// @access  Private
export const createOrGetChat = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.body;
    const currentUserId = (req as any).user.id;

    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    if (userId === currentUserId) {
      throw new AppError('Cannot create chat with yourself', 400);
    }

    // Check if user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      throw new AppError('User not found', 404);
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [currentUserId, userId], $size: 2 },
    })
      .populate('participants', 'username email avatar')
      .populate('lastMessage');

    if (chat) {
      return res.status(200).json({
        success: true,
        data: chat,
      });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [currentUserId, userId],
      isGroupChat: false,
    });

    chat = await Chat.findById(chat._id)
      .populate('participants', 'username email avatar')
      .populate('lastMessage');

    return res.status(201).json({
      success: true,
      data: chat,
    });
  }
);

// @desc    Get all chats for current user
// @route   GET /api/chat
// @access  Private
export const getChats = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const currentUserId = (req as any).user.id;

    const chats = await Chat.find({
      participants: currentUserId,
    })
      .populate('participants', 'username email phone avatar')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    // Add online status for each participant
    const chatsWithStatus = await Promise.all(
      chats.map(async (chat) => {
        const chatObj = chat.toObject();
        const participantsWithStatus = await Promise.all(
          chatObj.participants.map(async (participant: any) => {
            const isOnline = await isUserOnline(participant._id.toString());
            return {
              ...participant,
              online: isOnline,
            };
          })
        );
        return {
          ...chatObj,
          participants: participantsWithStatus,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: chatsWithStatus.length,
      data: chatsWithStatus,
    });
  }
);

// @desc    Get chat by ID
// @route   GET /api/chat/:id
// @access  Private
export const getChatById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;
    const currentUserId = (req as any).user.id;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'username email phone avatar')
      .populate('lastMessage');

    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      (p) => p._id.toString() === currentUserId
    );

    if (!isParticipant) {
      return next(new AppError('You are not a participant in this chat', 403));
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  }
);

// @desc    Get messages for a chat
// @route   GET /api/chat/:id/messages
// @access  Private
export const getChatMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;
    const currentUserId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Check if user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === currentUserId
    );

    if (!isParticipant) {
      return next(new AppError('You are not a participant in this chat', 403));
    }

    // Get messages
    const messages = await Message.find({
      chat: chatId,
      deletedFor: { $ne: currentUserId },
    })
      .populate('sender', 'username email avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({
      chat: chatId,
      deletedFor: { $ne: currentUserId },
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: page,
      data: messages.reverse(), // Reverse to show oldest first
    });
  }
);

// @desc    Create a group chat
// @route   POST /api/chat/group
// @access  Private
export const createGroupChat = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { participants, groupName } = req.body;
    const currentUserId = (req as any).user.id;

    if (!participants || participants.length < 2) {
      throw new AppError('Group must have at least 3 participants', 400);
    }

    if (!groupName) {
      throw new AppError('Group name is required', 400);
    }

    // Add current user to participants if not included
    if (!participants.includes(currentUserId)) {
      participants.push(currentUserId);
    }

    const chat = await Chat.create({
      participants,
      isGroupChat: true,
      groupName,
      groupAdmin: currentUserId,
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'username email avatar')
      .populate('groupAdmin', 'username email avatar');

    res.status(201).json({
      success: true,
      data: populatedChat,
    });
  }
);

// @desc    Delete message
// @route   DELETE /api/chat/message/:id
// @access  Private
export const deleteMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const messageId = req.params.id;
    const currentUserId = (req as any).user.id;
    const { deleteForEveryone } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    if (deleteForEveryone && message.sender.toString() !== currentUserId) {
      return next(
        new AppError('You can only delete your own messages for everyone', 403)
      );
    }

    if (deleteForEveryone) {
      message.isDeleted = true;
      message.content = 'This message was deleted';
    } else {
      if (!message.deletedFor.includes(currentUserId as any)) {
        message.deletedFor.push(currentUserId as any);
      }
    }

    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  }
);

// @desc    Search users
// @route   GET /api/chat/search/users
// @access  Private
export const searchUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { query } = req.query;
    const currentUserId = (req as any).user.id;

    if (!query || typeof query !== 'string') {
      throw new AppError('Search query is required', 400);
    }

    // Search by username, email, or phone
    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    })
      .select('username email phone avatar')
      .limit(10);

    // Add online status
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const userId = (user._id as any).toString();
        const isOnline = await isUserOnline(userId);
        return {
          ...user.toObject(),
          online: isOnline,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStatus.length,
      data: usersWithStatus,
    });
  }
);

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
export const deleteChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.id;
    const currentUserId = (req as any).user.id;

    // Find chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(
      (p) => p.toString() === currentUserId
    );

    if (!isParticipant) {
      return next(new AppError('You are not authorized to delete this chat', 403));
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    });
  }
);

// @desc    Upload media file for chat message
// @route   POST /api/chat/upload-media
// @access  Private
export const uploadMediaFile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    // Get file info
    const fileUrl = `/uploads/chat-media/${req.file.filename}`;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    // Determine file type
    let fileType: 'image' | 'video' = 'image';
    if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(fileExtension)) {
      fileType = 'video';
    }

    console.log(`✅ Media uploaded: ${req.file.filename} (${fileType})`);

    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        type: fileType,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  }
);

