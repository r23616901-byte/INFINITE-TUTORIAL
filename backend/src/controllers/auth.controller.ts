import { Request, Response } from 'express';
import { AuthRequest, RoleType } from '../types';
import { comparePassword, hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { findUserByIdentifier, findUserById, updateUserPassword } from '../services/userService';

/**
 * POST /api/auth/login
 * Authenticates user via phone number (for Parents) or Gmail/Email (for Teacher & Admin)
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { identifier, phone, email, password } = req.body;

  const loginId = identifier || phone || email;

  if (!loginId || !password) {
    res.status(400).json({
      success: false,
      message: 'Login identifier (phone number or email) and password are required',
    });
    return;
  }

  try {
    const user = await findUserByIdentifier(String(loginId));

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid login credentials',
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

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid login credentials',
      });
      return;
    }

    const token = signToken({
      userId: user.id,
      role: user.role as RoleType,
      phone: user.phone,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          role: user.role,
          name: user.name,
          mustChangePassword: user.mustChangePassword,
        },
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
    });
  }
};

/**
 * POST /api/auth/logout
 * Confirms session termination
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const profile = user.admin || user.teacher || user.parent || null;

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        name: user.name,
        mustChangePassword: user.mustChangePassword,
        profile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Auth GetMe Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error retrieving user profile',
    });
  }
};

/**
 * POST /api/auth/change-password
 * Changes user password and clears mustChangePassword flag
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: 'Both current password and new password are required',
    });
    return;
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    });
    return;
  }

  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    const newHash = await hashPassword(newPassword);
    await updateUserPassword(user.id, newHash);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. You can now use your new password.',
    });
  } catch (error) {
    console.error('[Auth ChangePassword Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error changing password',
    });
  }
};
