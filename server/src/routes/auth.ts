import express from 'express';
import { getCurrentUser, registerUser, loginUser, logoutUser } from '../controllers/auth.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser as unknown as express.RequestHandler);
router.post('/login', loginUser as unknown as express.RequestHandler);
router.post('/logout', logoutUser as unknown as express.RequestHandler);

// Protected routes
router.get('/me', auth as unknown as express.RequestHandler, getCurrentUser as unknown as express.RequestHandler);

export default router;