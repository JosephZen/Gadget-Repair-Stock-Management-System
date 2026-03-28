import express from 'express';
import { getTutorials, addTutorial, deleteTutorial } from '../controllers/tutorialController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getTutorials);
router.post('/', authenticateToken, addTutorial);
router.delete('/:id', authenticateToken, deleteTutorial);

export default router;
