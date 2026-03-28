import express from 'express';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../controllers/folderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getFolders);
router.post('/', authenticateToken, createFolder);
router.put('/:id', authenticateToken, updateFolder);
router.delete('/:id', authenticateToken, deleteFolder);

export default router;
