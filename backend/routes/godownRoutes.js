import express from 'express';
import { 
  getAllGodowns, 
  getGodownById, 
  createGodown, 
  updateGodown, 
  deleteGodown 
} from '../controllers/godownController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllGodowns);
router.get('/:id', getGodownById);
router.post('/', authenticateToken, createGodown);
router.put('/:id', authenticateToken, updateGodown);
router.delete('/:id', authenticateToken, deleteGodown);

export default router;
