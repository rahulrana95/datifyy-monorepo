import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { DatifyyUsersLogin } from '../../models/entities/DatifyyUsersLogin';
import { DatifyyUsersInformation } from '../../models/entities/DatifyyUsersInformation';
import { AppError } from '../../errors/AppError';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  isAdmin: boolean;
  profile?: any;
}

interface JWTPayload {
  id: number;
  email: string;
  isadmin: boolean;
}

/**
 * Authenticated Request Interface
 * Extends Express Request to include authenticated user data
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}


/**
 * Authenticated Request Interface
 * Extends Express Request to include authenticated user data
 */
export interface AuthenticatedAdminRequest extends Request {
  admin: AuthenticatedUser;
}



// STEP 1: Add a function to get DataSource
// This function will try multiple ways to get the DataSource
function getDataSource(): DataSource {
  // Option 1: Check if it's available globally (for backward compatibility)
  if ((global as any).AppDataSource) {
    return (global as any).AppDataSource;
  }
  
  // Option 2: Import from your index file
  // You'll need to export AppDataSource from your index.ts file
  try {
    const { AppDataSource } = require('../..');
    if (AppDataSource && AppDataSource.isInitialized) {
      return AppDataSource;
    }
  } catch (error) {
    // Continue to next option
  }
  
  // If no DataSource found, throw error
  throw new Error('DataSource not available. Make sure database is initialized.');
}

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract token from header or cookies
      const token = extractToken(req);
      
      if (!token) {
        throw new AppError('Access denied. No token provided.', 401, 'NO_TOKEN');
      }

      // Verify token
      const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
      const decoded = jwt.verify(token, secretKey) as JWTPayload;

      // STEP 2: Get DataSource using the helper function
      const dataSource = getDataSource();
      
      // Get user from database
      const userRepository = dataSource.getRepository(DatifyyUsersLogin);
      const user = await userRepository.findOne({
        where: { 
          id: decoded.id, 
          email: decoded.email,
          isactive: true 
        }
      });

      if (!user) {
        throw new AppError('User not found or inactive', 404, 'USER_NOT_FOUND');
      }

      // Optionally load user profile
      const userProfileRepo = dataSource.getRepository(DatifyyUsersInformation);
      const profile = await userProfileRepo.findOne({
        where: { 
          userLogin: { id: user.id },
          isDeleted: false 
        }
      });

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        isAdmin: user.isadmin || false,
        profile: profile || undefined
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Authorization middleware - requires admin privileges
 */
export function requireAdmin() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
      return;
    }

    if (!req.user.isAdmin) {
      next(new AppError('Admin privileges required', 403, 'ADMIN_REQUIRED'));
      return;
    }

    next();
  };
}

/**
 * Authorization middleware - requires specific role
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
      return;
    }

    // This is a placeholder - you would check actual user roles here
    // For now, we'll just check if admin
    const userRole = req.user.isAdmin ? 'admin' : 'user';
    
    if (!roles.includes(userRole)) {
      next(new AppError(`Required role: ${roles.join(' or ')}`, 403, 'INSUFFICIENT_ROLE'));
      return;
    }

    next();
  };
}

/**
 * Optional authentication - doesn't fail if no token, but adds user if present
 */
export function optionalAuth() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = extractToken(req);
      
      if (!token) {
        next();
        return;
      }

      // If token exists, verify it
      const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';
      const decoded = jwt.verify(token, secretKey) as JWTPayload;

      // STEP 3: Use getDataSource() here too
      const dataSource = getDataSource();
      const userRepository = dataSource.getRepository(DatifyyUsersLogin);
      const user = await userRepository.findOne({
        where: { 
          id: decoded.id, 
          email: decoded.email,
          isactive: true 
        }
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          isAdmin: user.isadmin || false
        };
      }

      next();
    } catch (error) {
      // If token is invalid, just continue without user
      next();
    }
  };
}

/**
 * Extract token from request
 */
function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  
  // Check Authorization header without Bearer prefix (for backward compatibility)
  if (authHeader) {
    return authHeader;
  }
  
  return null;
}