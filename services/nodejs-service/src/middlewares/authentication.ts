import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../index';
import { DatifyyUsersLogin } from '../models/entities/DatifyyUsersLogin';
import { DatifyyUsersInformation } from '../models/entities/DatifyyUsersInformation';

interface TokenPayload {
  userId: number;
  isAdmin: boolean;
}

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token ?? req.headers.authorization?.split(' ')[1];
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

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};



export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || req.cookies.token; // Get token from header or cookies
  const secretKey = process.env.JWT_SECRET as string; 

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, secretKey) as { email: string; id: string; isadmin: boolean };
    const userRepository = AppDataSource.getRepository(DatifyyUsersLogin);
    const userProfilesRepository = AppDataSource.getRepository(DatifyyUsersInformation);

    const user = await userRepository.findOne({ where: { id: Number(decodedToken.id), email: decodedToken.email, isactive: true } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

     const userProfile = await userProfilesRepository.findOne({
      where: { 
        userLogin: user,  // Use the foreign key directly
        isDeleted: false 
      },
      relations: ["userLogin"],
     });
    
    if (!userProfile) {
      res.status(404).json({ message: "User profile not found." });
      return;
    }

    req.user = { id: user.id, email: user.email, isAdmin: decodedToken.isadmin, profile: userProfile };

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(403).json({ message: "Invalid or expired token." });
    return;
  }
};



export const checkIsAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ message: 'Access denied, admin privileges required' });
    return;
  }
  next();
};