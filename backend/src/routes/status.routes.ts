import express from 'express';
import {
  createStatus,
  getStatuses,
  getMyStatuses,
  getUserStatuses,
  viewStatus,
  deleteStatus,
  uploadStatusMedia,
} from '../controllers/status.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadStatusMedia as uploadMiddleware } from '../middleware/upload.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Status routes
router.post('/', createStatus);
router.get('/', getStatuses);
router.get('/my', getMyStatuses);
router.get('/user/:userId', getUserStatuses);
router.put('/:id/view', viewStatus);
router.delete('/:id', deleteStatus);

// Media upload route
router.post('/upload-media', uploadMiddleware.single('media'), uploadStatusMedia);

export default router;

