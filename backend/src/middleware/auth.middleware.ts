import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

// Protect routes - check if user is authenticated
export const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Get token from header or cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return next(
        new AppError('You are not logged in. Please log in to access this resource', 401)
      );
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch (error) {
      return next(new AppError('Invalid or expired token. Please log in again', 401));
    }

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401)
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return next(
        new AppError('Your account has been deactivated. Please contact support', 403)
      );
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('Password recently changed. Please log in again', 401)
      );
    }

    // Grant access to protected route
    (req as any).user = user;
    next();
  }
);

// Optional authentication - check if user is authenticated but don't require it
export const optionalAuth = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Get token from header or cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        (req as any).user = user;
      }
    } catch (error) {
      // Invalid token, continue without authentication
    }

    next();
  }
);

