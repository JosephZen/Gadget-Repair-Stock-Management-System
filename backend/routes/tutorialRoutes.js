import express from 'express';
import { getTutorials, addTutorial, deleteTutorial } from '../controllers/tutorialController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getTutorials);
router.post('/', isAuthenticated, addTutorial);
router.delete('/:id', isAuthenticated, deleteTutorial);

export default router;
