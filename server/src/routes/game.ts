import express from 'express';
import { getStats, updateStats } from '../controllers/game.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Route to get user stats - requires authentication
router.get('/stats', auth as unknown as express.RequestHandler, getStats as unknown as express.RequestHandler);

// Route to update user stats - requires authentication
router.post('/stats/update', auth as unknown as express.RequestHandler, updateStats as unknown as express.RequestHandler);

export default router; 