import express from 'express';
import { getSolderingProjects, addSolderingProject, deleteSolderingProject } from '../controllers/solderingController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getSolderingProjects);
router.post('/', isAuthenticated, addSolderingProject);
router.delete('/:id', isAuthenticated, deleteSolderingProject);

export default router;
