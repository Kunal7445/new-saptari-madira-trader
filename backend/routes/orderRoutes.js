import express from 'express';
import { 
  getAllOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder,
  getRecentOrders 
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/recent', getRecentOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id/status', authenticateToken, updateOrderStatus);
router.delete('/:id', authenticateToken, deleteOrder);

export default router;
