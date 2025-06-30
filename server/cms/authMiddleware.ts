import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
// If JWT_SECRET is not set, throw an error
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Secret key for JWT
// In a production environment, this should be stored in an environment variable
// const JWT_SECRET = 'ad0ff08c5825fcd9053fc4b2c25743c455aab00d344c012a0fe4417f0d823217';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  username: string;
  role: string;
}

// Authenticate middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if the header has the correct format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid authentication format' });
    }
    
    // Extract the token
    const token = authHeader.substring(7);
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Attach the user info to the request
    (req as any).user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
    
    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin-only middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Generate JWT token
export const generateToken = (user: { id: string; username: string; role: string }) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};