import express from 'express';
import {
  createOrGetChat,
  getChats,
  getChatById,
  getChatMessages,
  createGroupChat,
  deleteMessage,
  searchUsers,
  deleteChat,
  uploadMediaFile,
} from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadChatMedia } from '../middleware/upload.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Chat routes
router.post('/', createOrGetChat);
router.get('/', getChats);
router.get('/search/users', searchUsers);
router.post('/group', createGroupChat);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);
router.get('/:id/messages', getChatMessages);

// Media upload route
router.post('/upload-media', uploadChatMedia.single('media'), uploadMediaFile);

// Message routes
router.delete('/message/:id', deleteMessage);

export default router;

