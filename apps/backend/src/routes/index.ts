import { Router } from 'express';
import matchController from '@bakcontrollers/matchController';

const router = Router();

// Health check
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Matches endpoint
router.get('/matches', matchController.getMatches);

export default router;