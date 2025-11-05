import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  updateProfile,
  uploadProfileAvatar,
  checkUsername,
  checkEmail,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadAvatar } from '../middleware/upload.middleware';
import {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  validate,
} from '../middleware/validation.middleware';
import {
  authRateLimiter,
  passwordResetRateLimiter,
} from '../middleware/rateLimiter';

const router = express.Router();

// Public routes
router.post('/register', authRateLimiter, registerValidation, validate, register);
router.post('/login', authRateLimiter, loginValidation, validate, login);
router.post('/logout', logout);

// Check availability routes
router.get('/check-username/:username', checkUsername);
router.get('/check-email/:email', checkEmail);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.patch('/update-profile', protect, updateProfile);
router.post('/upload-avatar', protect, uploadAvatar.single('avatar'), uploadProfileAvatar);
router.patch(
  '/update-password',
  protect,
  passwordResetRateLimiter,
  updatePasswordValidation,
  validate,
  updatePassword
);

export default router;

