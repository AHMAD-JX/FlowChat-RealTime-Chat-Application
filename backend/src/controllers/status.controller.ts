import { Request, Response, NextFunction } from 'express';
import Status from '../models/Status.model';
import User from '../models/User.model';
import Friend from '../models/Friend.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import path from 'path';
import { getIO } from '../socket/socket';

// @desc    Create a new status
// @route   POST /api/status
// @access  Private
export const createStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user.id;
    const { content, type, mediaUrl, backgroundColor, textColor, font } = req.body;

    if (!content || !type) {
      throw new AppError('Content and type are required', 400);
    }

    // Validate type
    if (!['text', 'image', 'video'].includes(type)) {
      throw new AppError('Invalid status type', 400);
    }

    // For media types, ensure mediaUrl is provided
    if ((type === 'image' || type === 'video') && !mediaUrl) {
      throw new AppError('Media URL is required for image/video statuses', 400);
    }

    // Calculate expiry time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create status
    const status = await Status.create({
      user: userId,
      content,
      type,
      mediaUrl,
      backgroundColor: backgroundColor || '#25d366',
      textColor: textColor || '#ffffff',
      font: font || 'Inter',
      expiresAt,
    });

    // Populate user info
    await status.populate('user', 'username email avatar');

    // Notify friends about new status
    const io = getIO();
    if (io) {
      const friends = await Friend.find({
        $or: [
          { user: userId, status: 'accepted' },
          { friend: userId, status: 'accepted' },
        ],
      });

      const friendIds = friends.map((f) =>
        f.user.toString() === userId ? f.friend.toString() : f.user.toString()
      );

      friendIds.forEach((friendId) => {
        io.to(`user:${friendId}`).emit('status:new', {
          status: {
            _id: status._id,
            user: status.user,
            type: status.type,
            createdAt: status.createdAt,
            expiresAt: status.expiresAt,
          },
        });
      });
    }

    console.log(`✅ Status created: ${status._id} by ${userId}`);

    res.status(201).json({
      success: true,
      data: status,
    });
  }
);

// @desc    Get all statuses from friends
// @route   GET /api/status
// @access  Private
export const getStatuses = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user.id;

    // Get all friends
    const friends = await Friend.find({
      $or: [
        { user: userId, status: 'accepted' },
        { friend: userId, status: 'accepted' },
      ],
    });

    const friendIds = friends.map((f) =>
      f.user.toString() === userId ? f.friend.toString() : f.user.toString()
    );

    // Include current user to get their own statuses
    const userIds = [userId, ...friendIds];

    // Get non-expired statuses from friends and current user
    const now = new Date();
    const statuses = await Status.find({
      user: { $in: userIds },
      expiresAt: { $gt: now },
    })
      .populate('user', 'username email avatar')
      .populate('views.user', 'username avatar')
      .sort({ createdAt: -1 });

    // Group statuses by user
    const statusesByUser = statuses.reduce((acc: any, status) => {
      const userId = (status.user as any)._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: status.user,
          statuses: [],
        };
      }
      acc[userId].statuses.push(status);
      return acc;
    }, {});

    // Convert to array and sort by latest status
    const groupedStatuses = Object.values(statusesByUser).sort((a: any, b: any) => {
      const latestA = new Date(a.statuses[0].createdAt).getTime();
      const latestB = new Date(b.statuses[0].createdAt).getTime();
      return latestB - latestA;
    });

    res.status(200).json({
      success: true,
      data: groupedStatuses,
    });
  }
);

// @desc    Get my statuses
// @route   GET /api/status/my
// @access  Private
export const getMyStatuses = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user.id;

    const now = new Date();
    const statuses = await Status.find({
      user: userId,
      expiresAt: { $gt: now },
    })
      .populate('views.user', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: statuses,
    });
  }
);

// @desc    Get user's statuses
// @route   GET /api/status/user/:userId
// @access  Private
export const getUserStatuses = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.params;
    const currentUserId = (req as any).user.id;

    // Check if users are friends or viewing own status
    if (userId !== currentUserId) {
      const friendship = await Friend.findOne({
        $or: [
          { user: currentUserId, friend: userId, status: 'accepted' },
          { user: userId, friend: currentUserId, status: 'accepted' },
        ],
      });

      if (!friendship) {
        throw new AppError('You can only view statuses of your friends', 403);
      }
    }

    const now = new Date();
    const statuses = await Status.find({
      user: userId,
      expiresAt: { $gt: now },
    })
      .populate('user', 'username email avatar')
      .populate('views.user', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: statuses,
    });
  }
);

// @desc    View a status (mark as viewed)
// @route   PUT /api/status/:id/view
// @access  Private
export const viewStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const status = await Status.findById(id).populate('user', 'username email avatar');

    if (!status) {
      throw new AppError('Status not found', 404);
    }

    // Check if status is expired
    if (status.isExpired()) {
      throw new AppError('Status has expired', 410);
    }

    // Don't add view if viewing own status
    if (status.user._id.toString() !== userId) {
      status.addView(userId);
      await status.save();

      // Notify status owner about new view
      const io = getIO();
      if (io) {
        const viewer = await User.findById(userId).select('username avatar');
        io.to(`user:${status.user._id}`).emit('status:viewed', {
          statusId: status._id,
          viewer: {
            _id: viewer?._id,
            username: viewer?.username,
            avatar: viewer?.avatar,
          },
          viewedAt: new Date(),
        });
      }
    }

    await status.populate('views.user', 'username avatar');

    res.status(200).json({
      success: true,
      data: status,
    });
  }
);

// @desc    Delete a status
// @route   DELETE /api/status/:id
// @access  Private
export const deleteStatus = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const status = await Status.findById(id);

    if (!status) {
      throw new AppError('Status not found', 404);
    }

    // Check if user owns the status
    if (status.user.toString() !== userId) {
      throw new AppError('You can only delete your own statuses', 403);
    }

    await Status.findByIdAndDelete(id);

    console.log(`✅ Status deleted: ${id} by ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Status deleted successfully',
    });
  }
);

// @desc    Upload status media file
// @route   POST /api/status/upload-media
// @access  Private
export const uploadStatusMedia = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    // Get file info
    const fileUrl = `/uploads/status-media/${req.file.filename}`;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    // Determine file type
    let fileType: 'image' | 'video' = 'image';
    if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(fileExtension)) {
      fileType = 'video';
    }

    console.log(`✅ Status media uploaded: ${req.file.filename} (${fileType})`);

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

