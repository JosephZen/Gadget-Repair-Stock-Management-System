import express from 'express';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../controllers/folderController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getFolders);
router.post('/', isAuthenticated, createFolder);
router.put('/:id', isAuthenticated, updateFolder);
router.delete('/:id', isAuthenticated, deleteFolder);

export default router;
