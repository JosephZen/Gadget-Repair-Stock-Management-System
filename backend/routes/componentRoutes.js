import express from 'express';
import { getComponentById, addComponent, updateComponent, getAllComponents, deleteComponent, addSupplierLink, deleteSupplierLink } from '../controllers/componentController.js';

const router = express.Router();

router.get('/', getAllComponents);
router.get('/:id', getComponentById);
router.post('/', addComponent);
router.put('/:id', updateComponent);
router.delete('/:id', deleteComponent);

router.post('/:id/links', addSupplierLink);
router.delete('/links/:linkId', deleteSupplierLink);

export default router;
