import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { AppError } from '../utils/AppError';

// Ensure uploads directories exist
const avatarsDir = path.join(__dirname, '../../public/uploads/avatars');
const chatMediaDir = path.join(__dirname, '../../public/uploads/chat-media');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

if (!fs.existsSync(chatMediaDir)) {
  fs.mkdirSync(chatMediaDir, { recursive: true });
}

// Configure storage for avatars
const avatarStorage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, avatarsDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    // Generate unique filename: userId-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// Configure storage for chat media
const chatMediaStorage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, chatMediaDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    // Generate unique filename: media-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

// File filter - only allow images for avatars
const avatarFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed extensions
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed (jpeg, jpg, png, gif, webp)', 400) as any);
  }
};

// File filter - allow images and videos for chat media
const chatMediaFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed extensions
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /^(image|video)\//.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('Only image and video files are allowed', 400) as any);
  }
};

// Create multer upload instance for avatars
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: avatarFileFilter,
});

// Create multer upload instance for chat media
export const uploadChatMedia = multer({
  storage: chatMediaStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size for videos
  },
  fileFilter: chatMediaFileFilter,
});

// Helper to delete old avatar
export const deleteOldAvatar = (avatarUrl: string | undefined): void => {
  if (!avatarUrl) return;

  try {
    // Extract filename from URL
    const filename = avatarUrl.split('/').pop();
    if (!filename) return;

    const filepath = path.join(avatarsDir, filename);
    
    // Check if file exists and delete
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`Deleted old avatar: ${filename}`);
    }
  } catch (error) {
    console.error('Error deleting old avatar:', error);
  }
};

// Helper to delete chat media file
export const deleteChatMedia = (mediaUrl: string | undefined): void => {
  if (!mediaUrl) return;

  try {
    // Extract filename from URL
    const filename = mediaUrl.split('/').pop();
    if (!filename) return;

    const filepath = path.join(chatMediaDir, filename);
    
    // Check if file exists and delete
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log(`Deleted chat media: ${filename}`);
    }
  } catch (error) {
    console.error('Error deleting chat media:', error);
  }
};

