import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { deleteOldAvatar } from '../middleware/upload.middleware';

// Register new user
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, phone, password, confirmPassword, countryCode } =
      req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, ...(phone ? [{ phone }] : [])],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return next(new AppError('Email already in use', 400));
      }
      if (existingUser.username === username) {
        return next(new AppError('Username already taken', 400));
      }
      if (existingUser.phone === phone) {
        return next(new AppError('Phone number already in use', 400));
      }
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      phone,
      password,
      countryCode,
    });

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    // Send response with cookie
    res
      .status(201)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            countryCode: user.countryCode,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            createdAt: user.createdAt,
          },
          token,
        },
      });
  }
);

// Login user
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { emailOrPhone, password } = req.body;

    // Check if email/phone and password are provided
    if (!emailOrPhone || !password) {
      return next(
        new AppError('Please provide email/phone and password', 400)
      );
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(
        new AppError('Your account has been deactivated. Please contact support', 403)
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    // Send response with cookie
    res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            countryCode: user.countryCode,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            lastLogin: user.lastLogin,
          },
          token,
        },
      });
  }
);

// Logout user
export const logout = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res
      .status(200)
      .cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // 10 seconds
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'Logout successful',
        data: null,
      });
  }
);

// Get current user
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById((req as any).user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  }
);

// Update password
export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Check if all fields are provided
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return next(new AppError('New passwords do not match', 400));
    }

    // Get user with password
    const user = await User.findById((req as any).user.id).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = user.generateAuthToken();

    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Password updated successfully',
        data: {
          token,
        },
      });
  }
);

// Check if username is available
export const checkUsername = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { username } = req.params;

    const user = await User.findOne({ username });

    res.status(200).json({
      success: true,
      data: {
        available: !user,
      },
    });
  }
);

// Check if email is available
export const checkEmail = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.params;

    const user = await User.findOne({ email });

    res.status(200).json({
      success: true,
      data: {
        available: !user,
      },
    });
  }
);

// Update user profile
export const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { bio, avatar } = req.body;

    // Validate bio length
    if (bio && bio.length > 500) {
      return next(new AppError('Bio must not exceed 500 characters', 400));
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  }
);

// Upload avatar
export const uploadProfileAvatar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    console.log('Upload avatar request for user:', userId);

    if (!req.file) {
      console.log('No file in request');
      return next(new AppError('Please upload an image', 400));
    }

    console.log('File uploaded:', req.file.filename);

    // Get current user to delete old avatar
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      console.log('User not found:', userId);
      return next(new AppError('User not found', 404));
    }

    console.log('Current user found, old avatar:', currentUser.avatar);

    // Delete old avatar if exists
    if (currentUser.avatar) {
      deleteOldAvatar(currentUser.avatar);
    }

    // Generate avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    console.log('New avatar URL:', avatarUrl);

    // Update user with new avatar
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log('User not found after update:', userId);
      return next(new AppError('User not found', 404));
    }

    console.log('Avatar updated successfully for user:', user.username);

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  }
);

