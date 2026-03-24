import express from 'express';
import { getComponentById, addComponent, updateComponent, getAllComponents, deleteComponent } from '../controllers/componentController.js';

const router = express.Router();

router.get('/', getAllComponents);
router.get('/:id', getComponentById);
router.post('/', addComponent);
router.put('/:id', updateComponent);
router.delete('/:id', deleteComponent);

export default router;
