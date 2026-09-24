import { Router } from 'express';
import { login, logout, getMe, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (requires Bearer token)
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePassword);

export default router;
