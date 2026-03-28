import express from 'express';
import { getSolderingProjects, addSolderingProject, deleteSolderingProject } from '../controllers/solderingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getSolderingProjects);
router.post('/', authenticateToken, addSolderingProject);
router.delete('/:id', authenticateToken, deleteSolderingProject);

export default router;
