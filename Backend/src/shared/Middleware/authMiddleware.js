import { verifyToken } from '../auth/jwt.js';
import { AppError } from '../errorHandling/errorHandler.js';

export const authMiddleware = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new AppError('Invalid token or token has expired.', 401));
    }

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};
