import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../index';
import { DatifyyUsersLogin } from '../models/entities/DatifyyUsersLogin';

interface TokenPayload {
  userId: number;
  isAdmin: boolean;
}

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied, token missing' });
    }

    const secretKey = process.env.JWT_SECRET as string; // Make sure JWT_SECRET is set in your environment variables
    const decoded = jwt.verify(token, secretKey) as TokenPayload;

    const userRepo = AppDataSource.getRepository(DatifyyUsersLogin);
    const user = await userRepo.findOneBy({ id: decoded.userId });

    if (!user || !decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied, admin privileges required' });
    }

    // @ts-expect-error
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
