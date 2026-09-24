import { Response, NextFunction } from 'express';
import { AuthRequest, RoleType } from '../types';
import { verifyJwt } from '../utils/jwt';
import { findUserById } from '../services/userService';

/**
 * Middleware to authenticate requests via Bearer JWT token
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyJwt(token);
    const user = await findUserById(payload.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid session. User no longer exists.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.',
      });
      return;
    }

    req.user = {
      id: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

/**
 * Middleware to restrict access by Role (ADMIN, TEACHER, PARENT)
 */
export const authorize = (...allowedRoles: RoleType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
};
